"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus, AlertCircle, ExternalLink, RefreshCw, Sparkles, TrendingUp, Shield } from "lucide-react";
import { cn, compressImage, fileToBase64, formatPrice, confidenceColor, confidenceLabel } from "@/lib/utils";

type Step = "form" | "loading" | "result" | "error";

const CATEGORIES = [
  { value: "", label: "Выберите категорию" },
  { value: "porcelain", label: "Фарфор и керамика" },
  { value: "furniture", label: "Мебель и декор" },
  { value: "painting", label: "Живопись" },
  { value: "jewelry", label: "Ювелирные украшения" },
  { value: "clocks", label: "Часы и хронометры" },
  { value: "coins", label: "Монеты и медали" },
  { value: "books", label: "Книги и рукописи" },
  { value: "icons", label: "Иконы" },
  { value: "silver", label: "Серебро и металл" },
  { value: "other", label: "Другое" },
];

const ERAS = [
  { value: "unknown", label: "Не знаю" },
  { value: "pre18", label: "До XVIII века" },
  { value: "18th", label: "XVIII век" },
  { value: "19th", label: "XIX век" },
  { value: "early20", label: "Нач. XX / Ар-деко" },
  { value: "soviet", label: "Советский период" },
  { value: "mid20", label: "Сер. XX века" },
];

const CONDITIONS = [
  { value: "excellent", label: "Отличное" },
  { value: "good", label: "Хорошее" },
  { value: "fair", label: "Дефекты" },
  { value: "damaged", label: "Реставрация" },
];

const LOAD_STEPS = [
  "Анализируем форму и материал...",
  "Ищем клеймо...",
  "Сравниваем с аукционами...",
  "Считаем рыночную стоимость...",
  "Готовим отчёт...",
];

export default function AppraisePage() {
  const [step, setStep] = useState<Step>("form");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [era, setEra] = useState("unknown");
  const [condition, setCondition] = useState("good");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadStep, setLoadStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [confAnim, setConfAnim] = useState(0);

  const addFiles = useCallback(async (files: File[]) => {
    if (photos.length >= 5) return;
    const toAdd = files.slice(0, 5 - photos.length);
    const compressed = await Promise.all(toAdd.map(f => compressImage(f, 1024, 0.85)));
    const newPreviews = compressed.map(f => URL.createObjectURL(f));
    setPhotos(p => [...p, ...compressed]);
    setPreviews(p => [...p, ...newPreviews]);
  }, [photos.length]);

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setPhotos(p => p.filter((_, j) => j !== i));
    setPreviews(p => p.filter((_, j) => j !== i));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 5 - photos.length,
    disabled: photos.length >= 5,
  });

  const reset = () => { setStep("form"); setPhotos([]); setPreviews([]); setResult(null); setError(null); setProgress(0); setLoadStep(0); };

  const runAppraisal = async () => {
    if (!photos.length) return;
    setStep("loading"); setLoadStep(0); setProgress(0);

    const pInt = setInterval(() => setProgress(p => Math.min(p + 0.8, 92)), 120);
    let si = 0;
    const sInt = setInterval(() => { si++; if (si < LOAD_STEPS.length) setLoadStep(si); }, 2500);

    try {
      const images = await Promise.all(photos.map(async f => ({ base64: await fileToBase64(f), mediaType: f.type || "image/jpeg" })));
      const res = await fetch("/api/appraise", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ images, category, era, condition, context }) });
      clearInterval(pInt); clearInterval(sInt);
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Ошибка сервера"); }
      const data = await res.json();
      setResult(data); setStep("result");
      setTimeout(() => setConfAnim(data.confidenceScore || 0), 300);
    } catch (e) {
      clearInterval(pInt); clearInterval(sInt);
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
      setStep("error");
    }
  };

  // ── Loading ──
  if (step === "loading") return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
      <div className="relative mb-8">
        <svg width="68" height="68" viewBox="0 0 52 52" fill="none">
          <circle cx="22" cy="22" r="14" stroke="#D4A843" strokeWidth="2.5" strokeDasharray="88" strokeDashoffset="22" className="animate-spin-logo"/>
          <circle cx="22" cy="22" r="8" stroke="#8B6914" strokeWidth="1.5" className="animate-pulse-dot"/>
          <line x1="32" y1="32" x2="46" y2="46" stroke="#D4A843" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="22" cy="22" r="2.5" fill="#D4A843"/>
        </svg>
        <div className="absolute inset-0 rounded-full bg-antiqua-gold/10 animate-ping" style={{ animationDuration: "2s" }} />
      </div>
      <h2 className="font-display font-bold text-xl text-antiqua-coal text-center mb-1.5">Оцениваем предмет</h2>
      <p className="text-sm text-antiqua-muted text-center mb-7 max-w-[220px] leading-relaxed">Сравниваем с реальными аукционными продажами</p>
      <div className="w-full max-w-[260px] space-y-2.5 mb-6">
        {LOAD_STEPS.map((s, i) => (
          <div key={i} className={cn("flex items-center gap-2.5 transition-all duration-500", i < loadStep ? "opacity-35" : i === loadStep ? "opacity-100" : "opacity-20")}>
            <div className={cn("w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all", i < loadStep ? "bg-antiqua-bronze" : i === loadStep ? "bg-antiqua-gold animate-pulse-dot" : "bg-antiqua-border")}>
              {i < loadStep && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>}
            </div>
            <span className={cn("text-xs", i === loadStep ? "text-antiqua-coal font-medium" : "text-antiqua-muted")}>{s}</span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-[260px]">
        <div className="h-1 bg-antiqua-border rounded-full overflow-hidden">
          <div className="h-full bg-antiqua-gold rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-center text-[10px] text-antiqua-muted mt-1">{Math.round(progress)}%</p>
      </div>
    </div>
  );

  // ── Error ──
  if (step === "error") return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
      <div className="text-5xl mb-4">😔</div>
      <h2 className="font-display font-bold text-xl text-antiqua-coal text-center mb-2">Что-то пошло не так</h2>
      <p className="text-sm text-antiqua-muted text-center mb-6 leading-relaxed">{error}</p>
      <button onClick={reset} className="btn-primary max-w-[240px]"><RefreshCw size={16}/>Попробовать снова</button>
    </div>
  );

  // ── Result ──
  if (step === "result" && result) {
    const isInsufficient = result.status === "insufficient_data";
    return (
      <div className="animate-fade-in pb-4">
        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={reset} className="w-8 h-8 rounded-full bg-antiqua-surface border border-antiqua-border flex items-center justify-center" aria-label="Назад">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="font-display font-bold text-lg text-antiqua-coal">Результат оценки</span>
        </div>

        {isInsufficient ? (
          <div className="px-5">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
              <div className="text-3xl mb-3">🔍</div>
              <h2 className="font-display font-bold text-lg text-amber-900 mb-2">Нужно больше данных</h2>
              <p className="text-sm text-amber-700 leading-relaxed mb-4">{result.insufficientReason || result.message || "Слишком мало похожих лотов."}</p>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Что поможет:</p>
                {["Фото донышка с клеймом крупным планом","Снимок при дневном освещении","Укажите производителя если знаете","Добавьте 2–3 ракурса"].map(t=>(
                  <div key={t} className="flex gap-2 text-xs text-amber-700"><span>→</span><span>{t}</span></div>
                ))}
              </div>
            </div>
            <button onClick={reset} className="btn-primary"><RefreshCw size={16}/>Попробовать снова</button>
          </div>
        ) : (<>
          {/* Price card */}
          <div className="mx-5 mb-4">
            <div className="bg-antiqua-coal rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-[20px] border-antiqua-gold/8 pointer-events-none"/>
              <div className="relative">
                <p className="text-[9px] font-semibold tracking-[2px] uppercase text-antiqua-gold mb-1.5">Оценка Antiqua · Аукционные данные</p>
                <h2 className="font-display font-bold text-[17px] text-white leading-tight mb-0.5">{result.itemName}</h2>
                <p className="text-[11px] text-antiqua-muted mb-3">{result.origin}</p>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="font-display font-bold text-3xl text-antiqua-gold">{formatPrice(result.priceMin)}</span>
                  <span className="text-antiqua-muted text-sm">— {formatPrice(result.priceMax)}</span>
                </div>
                <p className="text-[10px] text-antiqua-muted mb-3">Медиана {formatPrice(result.priceMedian)} · по {result.lotsFound} продажам</p>
                <div className="h-[3px] bg-white/10 rounded-full mb-1.5">
                  <div className="h-[3px] rounded-full transition-all duration-1000" style={{ width: `${confAnim}%`, background: confidenceColor(result.confidenceScore) }}/>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-antiqua-muted">Уверенность: {confidenceLabel(result.confidenceScore)}</span>
                  <span style={{ color: confidenceColor(result.confidenceScore) }} className="font-semibold">{result.confidenceScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {result.tags?.length > 0 && (
            <div className="px-5 mb-3">
              <p className="section-label mb-2">Признаки</p>
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((t: any, i: number) => (
                  <span key={i} className={cn("tag-pill", t.type === "positive" && "tag-positive", t.type === "caution" && "tag-caution")}>{t.label}</span>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="mx-5 mb-4 p-4 bg-antiqua-surface rounded-2xl border border-antiqua-border">
            <p className="text-sm text-antiqua-coal leading-relaxed">{result.explanation}</p>
            {result.confidenceReason && <p className="text-xs text-antiqua-muted mt-2 italic">{result.confidenceReason}</p>}
          </div>

          {/* Details */}
          <div className="px-5 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="card p-3">
                <div className="flex items-center gap-1.5 mb-1"><TrendingUp size={13} className="text-antiqua-bronze"/><span className="text-[9px] font-semibold uppercase tracking-wide text-antiqua-muted">Тренд</span></div>
                <p className="text-sm font-medium text-antiqua-coal">{result.trend || "—"}</p>
              </div>
              <div className="card p-3">
                <div className="flex items-center gap-1.5 mb-1"><Shield size={13} className="text-antiqua-bronze"/><span className="text-[9px] font-semibold uppercase tracking-wide text-antiqua-muted">Страховая</span></div>
                <p className="text-sm font-medium text-antiqua-coal">{result.insuranceValue ? formatPrice(result.insuranceValue) : "—"}</p>
              </div>
            </div>
            {result.whereToSell && (
              <div className="card p-3 mt-2">
                <span className="text-[9px] font-semibold uppercase tracking-wide text-antiqua-muted block mb-1">Где продать</span>
                <p className="text-sm text-antiqua-coal">{result.whereToSell}</p>
              </div>
            )}
          </div>

          {/* Lots */}
          {result.lots?.length > 0 && (
            <div className="px-5 mb-4">
              <p className="section-label mb-2">Похожие проданные лоты</p>
              <div className="space-y-2">
                {result.lots.map((lot: any, i: number) => (
                  <a key={i} href={lot.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 card active:scale-[0.99] transition-transform">
                    <div className="w-12 h-12 rounded-lg bg-antiqua-surface border border-antiqua-border flex-shrink-0 overflow-hidden">
                      {lot.imageUrl ? <img src={lot.imageUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xl">🏺</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-antiqua-coal truncate mb-0.5">{lot.title}</p>
                      <p className="text-[10px] text-antiqua-muted">{lot.sourceName} · {new Date(lot.date).toLocaleDateString("ru-RU", { month:"short", year:"numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-display font-bold text-sm text-antiqua-bronze">{formatPrice(lot.price, lot.currency)}</span>
                      <ExternalLink size={10} className="text-antiqua-muted"/>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 mb-3">
            <p className="text-[10px] text-antiqua-muted text-center leading-relaxed">Рыночный ориентир на основе {result.lotsFound} реальных продаж. Итоговая цена зависит от места и спроса.</p>
          </div>
          <div className="px-5">
            <button onClick={reset} className="btn-secondary w-full justify-center"><RefreshCw size={14}/>Оценить другой предмет</button>
          </div>
        </>)}
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="px-5 pb-8">
      <div className="screen-header px-0">
        <div className="eyebrow">Оценка антиквариата</div>
        <h1 className="font-display font-bold text-2xl text-antiqua-coal leading-tight">{photos.length === 0 ? "Нашли что-то ценное?" : `${photos.length} фото добавлено`}</h1>
        {photos.length === 0 && <p className="text-sm text-antiqua-muted mt-1">Загрузите 3–5 фото с разных сторон</p>}
      </div>

      {/* Upload */}
      {photos.length === 0 ? (
        <div {...getRootProps()} className={cn("border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all mb-4", isDragActive ? "border-antiqua-bronze bg-antiqua-bronze/5" : "border-antiqua-border bg-antiqua-surface")}>
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-xl bg-white border border-antiqua-border mx-auto mb-3 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <p className="font-medium text-sm text-antiqua-coal mb-1">{isDragActive ? "Отпустите фото" : "Добавить фотографии"}</p>
          <p className="text-xs text-antiqua-muted mb-3">До 5 фото · JPG, PNG, WEBP</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {["Фронт","Бок","Клеймо","Дефекты","Донышко"].map(t=>(
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-antiqua-border text-antiqua-muted">{t}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap mb-2.5">
            {previews.map((src, i) => (
              <div key={i} className="relative w-[calc(33%-6px)] aspect-square rounded-xl overflow-hidden border border-antiqua-border">
                <img src={src} alt={`Фото ${i+1}`} className="w-full h-full object-cover"/>
                <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-antiqua-coal/70 flex items-center justify-center" aria-label={`Удалить фото ${i+1}`}>
                  <X size={9} className="text-white"/>
                </button>
                <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{i+1}</span>
                </div>
              </div>
            ))}
            {photos.length < 5 && (
              <div {...getRootProps()} className="w-[calc(33%-6px)] aspect-square rounded-xl border-2 border-dashed border-antiqua-border flex flex-col items-center justify-center gap-1 cursor-pointer bg-antiqua-surface">
                <input {...getInputProps()}/>
                <Plus size={16} className="text-antiqua-muted"/>
                <span className="text-[10px] text-antiqua-muted">{photos.length}/5</span>
              </div>
            )}
          </div>
          {photos.length < 3 && (
            <div className="flex gap-2 items-start p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5"/>
              <p className="text-[11px] text-amber-700 leading-relaxed">Добавьте фото донышка — там клеймо. Это повышает точность на 20–30%.</p>
            </div>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-antiqua-muted block mb-1.5">Категория</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="form-input appearance-none">
            {CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-antiqua-muted block mb-1.5">Примерная эпоха</label>
          <select value={era} onChange={e=>setEra(e.target.value)} className="form-input appearance-none">
            {ERAS.map(e=><option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-antiqua-muted block mb-1.5">Состояние</label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(c=>(
              <button key={c.value} onClick={()=>setCondition(c.value)} className={cn("py-2.5 px-3 rounded-xl text-sm font-medium border transition-all", condition===c.value ? "bg-antiqua-coal text-white border-antiqua-coal" : "bg-white text-antiqua-coal border-antiqua-border")}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-antiqua-muted block mb-1.5">История предмета <span className="normal-case font-normal opacity-60">(необязательно)</span></label>
          <textarea value={context} onChange={e=>setContext(e.target.value)} placeholder="Откуда вещь? Производитель, страна, семейная история..." rows={3} className="form-input resize-none"/>
        </div>
      </div>

      <button onClick={runAppraisal} disabled={photos.length === 0} className="btn-primary">
        <Sparkles size={17} aria-hidden="true"/>
        {photos.length === 0 ? "Сначала добавьте фото" : "Оценить предмет"}
      </button>
      <p className="text-center text-xs text-antiqua-muted mt-2">3 оценки бесплатно · Результат за 15–30 секунд</p>
    </div>
  );
}
