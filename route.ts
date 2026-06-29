import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzePhotos(images: Array<{ base64: string; mediaType: string }>, context: string) {
  const imageContent = images.map(img => ({
    type: "image" as const,
    source: { type: "base64" as const, media_type: img.mediaType as any, data: img.base64 },
  }));

  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: `Ты — наблюдатель антиквариата. Описывай ТОЛЬКО то что видишь. Не интерпретируй, не называй цену.
Клеймо — процитируй дословно или "не различимо". Ответ ТОЛЬКО JSON без пояснений.`,
    messages: [{
      role: "user",
      content: [
        ...imageContent,
        { type: "text", text: `Контекст: "${context || "не указан"}"\nJSON:\n{"material":"","form":"","decoration":"","marks":"","condition":"","photo_quality":"good/acceptable/poor","missing_views":[],"likely_category":"","likely_era":"","keywords":[]}` }
      ]
    }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  try { return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim()); }
  catch { return { material:"н/д", form:"н/д", decoration:"н/д", marks:"не различимо", condition:"н/д", photo_quality:"poor", missing_views:[], likely_category:"other", likely_era:"unknown", keywords:[] }; }
}

async function searchEbay(keywords: string[]) {
  const appId = process.env.EBAY_APP_ID;
  if (!appId) return [];
  const query = keywords.slice(0, 4).join(" ");
  const url = new URL("https://svcs.ebay.com/services/search/FindingService/v1");
  url.searchParams.set("OPERATION-NAME", "findCompletedItems");
  url.searchParams.set("SERVICE-VERSION", "1.0.0");
  url.searchParams.set("SECURITY-APPNAME", appId);
  url.searchParams.set("RESPONSE-DATA-FORMAT", "JSON");
  url.searchParams.set("keywords", query);
  url.searchParams.set("itemFilter(0).name", "SoldItemsOnly");
  url.searchParams.set("itemFilter(0).value", "true");
  url.searchParams.set("sortOrder", "EndTimeSoonest");
  url.searchParams.set("paginationInput.entriesPerPage", "8");
  try {
    const r = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const data = await r.json();
    const items = data?.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || [];
    return items.filter((i: any) => parseFloat(i?.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "0") > 0).slice(0, 5).map((i: any) => ({
      id: i.itemId?.[0] || "",
      title: i.title?.[0] || "",
      price: parseFloat(i.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "0"),
      currency: i.sellingStatus?.[0]?.currentPrice?.[0]?.["@currencyId"] || "EUR",
      date: i.listingInfo?.[0]?.endTime?.[0] || new Date().toISOString(),
      sourceName: "eBay",
      url: i.viewItemURL?.[0],
      imageUrl: i.galleryURL?.[0],
    }));
  } catch { return []; }
}

function calcConfidence(vision: any, lots: any[], photoCount: number) {
  let s = 0;
  s += Math.min(lots.length * 3.5, 35);
  if (vision.marks && vision.marks !== "не различимо") s += 20;
  const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 18);
  const recent = lots.filter(l => new Date(l.date) > cutoff);
  s += Math.min((recent.length / Math.max(lots.length, 1)) * 18, 18);
  const qMap: Record<string, number> = { good: 15, acceptable: 8, poor: 2 };
  s += qMap[vision.photo_quality] || 0;
  s += Math.min(photoCount * 1.4, 7);
  if (vision.keywords?.length >= 3) s += 5;
  return Math.round(Math.min(s, 100));
}

async function synthesize(vision: any, lots: any[], confidence: number, input: any) {
  const lotsText = lots.length > 0
    ? lots.map((l, i) => `${i+1}. "${l.title}" — ${l.price} ${l.currency} (${l.sourceName}, ${new Date(l.date).toLocaleDateString("ru-RU")})`).join("\n")
    : "Похожих лотов не найдено";

  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 900,
    system: `Аукционный аналитик. Оценивай ТОЛЬКО на основе предоставленных данных. Если лотов < 3 — status "insufficient_data". Отвечай по-русски. Ответ ТОЛЬКО JSON.`,
    messages: [{
      role: "user",
      content: `Предмет: материал="${vision.material}", форма="${vision.form}", клеймо="${vision.marks}", состояние="${vision.condition}", эпоха="${vision.likely_era}"
Категория: ${input.category}, состояние владельца: ${input.condition}, контекст: "${input.context}"
Лоты:\n${lotsText}

JSON:
{"itemName":"","itemDescription":"","origin":"","priceMin":0,"priceMax":0,"priceMedian":0,"currency":"EUR","confidenceLabel":"","confidenceReason":"","tags":[{"label":"","type":"positive/caution/neutral"}],"whereToSell":"","insuranceValue":0,"trend":"","explanation":"","status":"success/low_confidence/insufficient_data","insufficientReason":""}`
    }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  try { return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim()); }
  catch { return { itemName:"Предмет антиквариата", itemDescription:"", origin:"", priceMin:0, priceMax:0, priceMedian:0, currency:"EUR", confidenceLabel:"Низкая", confidenceReason:"Ошибка", tags:[], whereToSell:"", insuranceValue:0, trend:"", explanation:"Произошла ошибка. Попробуйте ещё раз.", status:"insufficient_data" }; }
}

export async function POST(req: NextRequest) {
  try {
    const { images, category, era, condition, context } = await req.json();
    if (!images?.length) return NextResponse.json({ error: "Загрузите хотя бы одно фото" }, { status: 400 });
    if (images.length > 5) return NextResponse.json({ error: "Максимум 5 фотографий" }, { status: 400 });

    const vision = await analyzePhotos(images, context || "");
    if (vision.photo_quality === "poor" && images.length === 1) {
      return NextResponse.json({ status: "poor_quality", message: "Фото слишком тёмное или нечёткое", tips: vision.missing_views });
    }

    const lots = await searchEbay(vision.keywords || []);
    const confidence = calcConfidence(vision, lots, images.length);

    if (lots.length === 0 && confidence < 20) {
      return NextResponse.json({ status: "insufficient_data", vision, confidenceScore: confidence, message: "Слишком мало данных. Добавьте фото клейма.", tips: vision.missing_views });
    }

    const synthesis = await synthesize(vision, lots, confidence, { category, era, condition, context });
    return NextResponse.json({ ...synthesis, confidenceScore: confidence, lotsFound: lots.length, lots: lots.slice(0, 3) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера. Попробуйте ещё раз." }, { status: 500 });
  }
}
