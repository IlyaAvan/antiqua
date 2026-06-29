import Link from "next/link";
import { cn } from "@/lib/utils";

const CATS = ["Все", "Фарфор", "Часы", "Живопись", "Монеты", "Мебель", "Ювелирка"];

const ARTICLES = [
  { id:"meissen-marks", cat:"Фарфор", title:"Как отличить подлинный Мейссен за 5 минут", time:"8 мин", level:"Просто", bg:"#EAF3DE", emoji:"🔍" },
  { id:"pocket-watch-marks", cat:"Часы", title:"Как читать клеймо на карманных часах", time:"12 мин", level:"Средне", bg:"#FAEEDA", emoji:"⌚" },
  { id:"furniture-epochs", cat:"Мебель", title:"Барокко, ампир, ар-деко: гид по эпохам мебели", time:"20 мин", level:"Средне", bg:"#E8F5E0", emoji:"🪑" },
  { id:"coin-beginner", cat:"Монеты", title:"Топ-10 ошибок начинающего коллекционера монет", time:"6 мин", level:"Просто", bg:"#EEEDFE", emoji:"🪙" },
  { id:"craquelure", cat:"Живопись", title:"Кракелюр не лжёт: трещины выдают возраст картины", time:"15 мин", level:"Сложно", bg:"#FCE8E8", emoji:"🖼️" },
  { id:"gold-silver-hallmarks", cat:"Ювелирка", title:"Пробы золота и серебра: маркировки 20 стран", time:"10 мин", level:"Просто", bg:"#FDF0D0", emoji:"💎" },
  { id:"sevres-vs-meissen", cat:"Фарфор", title:"Севр vs Мейссен: великое противостояние", time:"18 мин", level:"Средне", bg:"#E1F5EE", emoji:"🫙" },
  { id:"soviet-porcelain", cat:"Фарфор", title:"Советский фарфор: ЛФЗ, ДФЗ и как отличить ценное", time:"14 мин", level:"Просто", bg:"#E6F1FB", emoji:"🏺" },
];

const LEVEL_COLORS: Record<string, string> = {
  Просто: "bg-green-50 text-green-700",
  Средне: "bg-amber-50 text-amber-700",
  Сложно: "bg-red-50 text-red-700",
};

export default function JournalPage() {
  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <div className="pb-4">
      <div className="px-5 pt-6 pb-4">
        <div className="eyebrow">Журнал Antiqua</div>
        <div className="flex items-end justify-between">
          <h1 className="font-display font-bold text-2xl text-antiqua-coal">Разбираемся вместе</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-5 pb-4 overflow-x-auto hide-scrollbar">
        {CATS.map((c, i) => (
          <button key={c} className={cn("text-[11px] px-3 py-1.5 rounded-full border transition-all flex-shrink-0 font-medium", i===0 ? "bg-antiqua-coal text-white border-antiqua-coal" : "bg-white text-antiqua-muted border-antiqua-border")}>
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      <div className="mx-5 mb-4 card overflow-hidden" style={{ background:"#1C1812" }}>
        <div className="h-[140px] flex items-center justify-center text-5xl" style={{ background:"linear-gradient(135deg,#2A2318,#1C1812)" }}>
          {featured.emoji}
        </div>
        <div className="p-4">
          <div className="text-[9px] font-semibold tracking-[2px] uppercase text-antiqua-gold mb-2">{featured.cat} · Рекомендуем</div>
          <h2 className="font-display font-bold text-[16px] text-white leading-snug mb-3">{featured.title}</h2>
          <div className="flex items-center gap-3 text-[10px] text-antiqua-muted">
            <span>🕐 {featured.time}</span>
            <span className={cn("px-2 py-0.5 rounded-full font-semibold", LEVEL_COLORS[featured.level])}>{featured.level}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {rest.map(a => (
          <div key={a.id} className="card overflow-hidden cursor-pointer active:scale-95 transition-transform">
            <div className="h-[90px] flex items-center justify-center text-4xl" style={{ background: a.bg }}>{a.emoji}</div>
            <div className="p-3">
              <div className="text-[9px] font-semibold tracking-[1.5px] uppercase text-antiqua-bronze mb-1.5">{a.cat}</div>
              <p className="text-[12px] font-medium text-antiqua-coal leading-snug mb-2">{a.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-antiqua-muted">{a.time}</span>
                <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-semibold", LEVEL_COLORS[a.level])}>{a.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz CTA */}
      <div className="mx-5 mt-4 bg-antiqua-surface rounded-2xl p-4 border border-antiqua-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-antiqua-bronze flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7F3EE" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm text-antiqua-coal mb-0.5">Проверьте свои знания</p>
          <p className="text-xs text-antiqua-muted">12 лотов — угадайте аукционные цены</p>
        </div>
        <Link href="/game" className="bg-antiqua-coal text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex-shrink-0">Играть</Link>
      </div>
    </div>
  );
}
