import Link from "next/link";
import { Search, MapPin, BookOpen, Trophy, ArrowRight, Shield, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="pb-8">

      {/* ── HERO ── */}
      <div className="relative bg-antiqua-coal overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-antiqua-gold/10 pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-antiqua-gold/8 pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-48 h-48 rounded-full border border-antiqua-bronze/10 pointer-events-none" />

        <div className="px-5 pt-12 pb-8 relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <svg width="32" height="32" viewBox="0 0 52 52" fill="none">
              <circle cx="22" cy="22" r="14" stroke="#D4A843" strokeWidth="2.5"/>
              <circle cx="22" cy="22" r="8" stroke="#8B6914" strokeWidth="1.5"/>
              <line x1="32" y1="32" x2="46" y2="46" stroke="#D4A843" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="22" cy="22" r="2.5" fill="#D4A843"/>
            </svg>
            <span className="font-display font-bold text-xl text-antiqua-bg tracking-tight">Antiqua</span>
          </div>

          <div className="text-[10px] font-semibold tracking-[2.5px] uppercase text-antiqua-bronze mb-2">
            Оценка антиквариата
          </div>
          <h1 className="font-display font-bold text-[30px] text-antiqua-bg leading-[1.12] mb-4">
            Ваша находка<br />может стоить<br />
            <span className="text-antiqua-gold">целое состояние.</span>
          </h1>
          <p className="text-sm text-antiqua-muted leading-relaxed mb-6 max-w-[280px]">
            Загрузите фото — сравним с реальными ценами 29 миллионов аукционных продаж
          </p>

          <Link href="/appraise" className="btn-primary mb-3">
            <Search size={17} aria-hidden="true" />
            Оценить предмет бесплатно
          </Link>
          <p className="text-[10px] text-antiqua-muted/70 text-center">3 оценки бесплатно · Без регистрации · 15–30 секунд</p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="px-5 -mt-4 mb-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: "29M+", lbl: "аукционных лотов", color: "text-antiqua-bronze" },
            { val: "81%",  lbl: "точность оценки",  color: "text-green-700" },
            { val: "€0",   lbl: "для старта",        color: "text-antiqua-coal" },
          ].map(s => (
            <div key={s.lbl} className="bg-white rounded-2xl border border-antiqua-border p-3 text-center shadow-sm">
              <div className={`font-display font-bold text-xl ${s.color}`}>{s.val}</div>
              <div className="text-[9px] text-antiqua-muted mt-0.5 leading-tight">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Как это работает</p>
        </div>
        <div className="space-y-2">
          {[
            { n:"01", t:"Сфотографируйте предмет", d:"3–5 фото с разных сторон. Донышко с клеймом — ключ к точной оценке.", icon:"📷" },
            { n:"02", t:"ИИ анализирует фото",     d:"Claude Vision определяет материал, эпоху, клейма и состояние.", icon:"🔍" },
            { n:"03", t:"Ищем в 29M лотов",         d:"Только реальные цены закрытых торгов. Не запрашиваемые — а проданные.", icon:"🏛️" },
            { n:"04", t:"Получаете честную оценку", d:"Диапазон цены, скор уверенности, похожие лоты с датами и ценами.", icon:"✨" },
          ].map(s => (
            <div key={s.n} className="flex gap-3 p-4 bg-white rounded-2xl border border-antiqua-border">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className="font-display text-antiqua-gold font-bold text-lg leading-none">{s.n}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <div className="pt-0.5">
                <div className="font-medium text-sm text-antiqua-coal mb-1">{s.t}</div>
                <div className="text-xs text-antiqua-muted leading-relaxed">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div className="mx-5 mb-6 bg-antiqua-surface rounded-2xl border border-antiqua-border p-4">
        <p className="section-label mb-3">Почему доверяют</p>
        <div className="space-y-2.5">
          {[
            { icon: Shield, t: "Только реальные продажи", d: "Данные из LiveAuctioneers, eBay Sold, Мешок.ру — закрытые торги, не желаемые цены" },
            { icon: TrendingUp, t: "Честность вместо уверенности", d: "При скоре ниже 50% — говорим что нужно ещё фото, а не угадываем" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-antiqua-coal flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-antiqua-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-antiqua-coal mb-0.5">{t}</p>
                <p className="text-xs text-antiqua-muted leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div className="px-5">
        <p className="section-label mb-3">Исследуйте</p>
        <div className="space-y-2.5">
          {[
            { href:"/map",     icon:MapPin,   t:"Карта рынков",       d:"12 400+ блошиных рынков Европы, Азии и России", bg:"bg-blue-50",   ic:"text-blue-700" },
            { href:"/journal", icon:BookOpen, t:"Журнал",             d:"Как отличить Мейссен, клейма, советский фарфор", bg:"bg-amber-50",  ic:"text-amber-700" },
            { href:"/game",    icon:Trophy,   t:"Игра «Угадай цену»", d:"6 реальных аукционных лотов — угадайте цены",   bg:"bg-green-50",  ic:"text-green-700" },
          ].map(({ href, icon:Icon, t, d, bg, ic }) => (
            <Link key={href} href={href} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-antiqua-border active:scale-[0.99] transition-transform">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={ic} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-antiqua-coal">{t}</p>
                <p className="text-xs text-antiqua-muted truncate">{d}</p>
              </div>
              <ArrowRight size={15} className="text-antiqua-muted flex-shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
