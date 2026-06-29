"use client";
import { useState, useCallback } from "react";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

const LOTS = [
  { emoji:"🏺", bg:"#EFEBE4", name:"Этрусская терракотовая амфора", desc:"Около 500 до н.э. · Превосходная сохранность · Провенанс задокументирован", lot:"#247", auction:"Sotheby's London, 2023", correct:18400, wrong:[1200,6500,54000], currency:"EUR", fact:"Редкая сохранность и задокументированное происхождение подняли цену выше типичного уровня для этрусской керамики." },
  { emoji:"🕰️", bg:"#FAEEDA", name:"Каминные часы в стиле Буль", desc:"Черепаховый панцирь и латунное маркетри · ок. 1710 · Париж", lot:"#891", auction:"Christie's Paris, 2024", correct:34000, wrong:[3800,12000,89000], currency:"EUR", fact:"Метод Буль — маркетри из черепашьего панциря. Документация происхождения удвоила итоговую цену." },
  { emoji:"🖼️", bg:"#E8F5E0", name:"Портрет, Нидерландская школа XVII в.", desc:"Холст, масло · Без подписи · Реставрация рамы", lot:"#44", auction:"Bonhams London, 2024", correct:7200, wrong:[680,22000,2100], currency:"EUR", fact:"Без атрибуции конкретному мастеру цена значительно ниже. Приписать авторство — и стоимость вырастет в 5–10 раз." },
  { emoji:"💍", bg:"#FDF0D0", name:"Кольцо с бирманским рубином 3.2 кт", desc:"Золото 18 карат · GIA-сертификат · Без нагрева · Женева", lot:"#12", auction:"Geneva Watches & Jewels, 2024", correct:52000, wrong:[8000,18500,110000], currency:"EUR", fact:"Бирманский рубин без термической обработки — редчайшая находка. GIA-сертификат поднял цену выше €50 000." },
  { emoji:"🫙", bg:"#E1F5EE", name:"Ваза Севрской мануфактуры", desc:"Фарфор · Позолота · Роспись пейзажем · 1847", lot:"#330", auction:"Dorotheum Wien, 2023", correct:28000, wrong:[4500,9000,65000], currency:"EUR", fact:"Клеймо «RF» (République Française) и дата подтверждены рентгеном. Схожие вазы — от €22 000 до €35 000." },
  { emoji:"🏛️", bg:"#EEEDFE", name:"Китайская фарфоровая ваза, Цин", desc:"Сине-белый фарфор · Эпоха Цяньлун · XVIII в.", lot:"#508", auction:"Sotheby's Hong Kong, 2024", correct:95000, wrong:[12000,38000,210000], currency:"EUR", fact:"Период Цяньлун — золотой век китайского фарфора. Хорошая сохранность и провенанс решают всё." },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - .5); }

export default function GamePage() {
  const [cur, setCur] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [choices, setChoices] = useState(() => shuffle([LOTS[0].correct, ...LOTS[0].wrong]));
  const [finished, setFinished] = useState(false);

  const lot = LOTS[cur];
  const isCorrect = chosen === lot.correct;

  const answer = useCallback((price: number) => {
    if (answered) return;
    setAnswered(true);
    setChosen(price);
    if (price === lot.correct) {
      const pts = streak >= 2 ? 200 : 100;
      setScore(s => s + pts);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  }, [answered, lot.correct, streak]);

  const next = () => {
    const nextIdx = cur + 1;
    if (nextIdx >= LOTS.length) { setFinished(true); return; }
    setCur(nextIdx);
    setChoices(shuffle([LOTS[nextIdx].correct, ...LOTS[nextIdx].wrong]));
    setAnswered(false);
    setChosen(null);
  };

  const restart = () => { setCur(0); setScore(0); setStreak(0); setAnswered(false); setChosen(null); setFinished(false); setChoices(shuffle([LOTS[0].correct, ...LOTS[0].wrong])); };

  if (finished) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
      <div className="text-6xl mb-5">🏆</div>
      <h2 className="font-display font-bold text-2xl text-antiqua-coal text-center mb-2">Игра окончена!</h2>
      <p className="text-sm text-antiqua-muted text-center mb-6">Вы набрали <span className="font-bold text-antiqua-bronze">{score}</span> очков из {LOTS.length * 100}</p>
      <div className="bg-white rounded-2xl border border-antiqua-border p-5 w-full mb-6">
        <div className="text-center mb-4">
          <div className="font-display text-4xl font-bold text-antiqua-bronze mb-1">{score}</div>
          <div className="text-sm text-antiqua-muted">итоговый счёт</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-antiqua-surface rounded-xl p-3"><div className="font-bold text-lg text-antiqua-coal">{Math.round(score / (LOTS.length * 100) * 100)}%</div><div className="text-xs text-antiqua-muted">точность</div></div>
          <div className="bg-antiqua-surface rounded-xl p-3"><div className="font-bold text-lg text-antiqua-coal">{streak}🔥</div><div className="text-xs text-antiqua-muted">серия</div></div>
        </div>
      </div>
      <button onClick={restart} className="btn-primary mb-3">Сыграть ещё раз</button>
      <Link href="/appraise" className="btn-secondary w-full justify-center">Оценить свой предмет →</Link>
    </div>
  );

  return (
    <div className="px-5 pb-8">
      <div className="screen-header px-0">
        <div className="eyebrow">Угадай цену</div>
        <h1 className="font-display font-bold text-2xl text-antiqua-coal">Аукционный лот</h1>
      </div>

      {/* Score */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white rounded-xl border border-antiqua-border p-3 text-center">
          <div className="font-display font-bold text-xl text-antiqua-coal">{score}</div>
          <div className="text-[10px] text-antiqua-muted mt-0.5">Очков</div>
        </div>
        <div className="bg-white rounded-xl border border-antiqua-border p-3 text-center">
          <div className="font-display font-bold text-xl text-antiqua-coal">{cur+1}/{LOTS.length}</div>
          <div className="text-[10px] text-antiqua-muted mt-0.5">Раунд</div>
        </div>
        <div className="bg-white rounded-xl border border-antiqua-border p-3 text-center">
          <div className="font-display font-bold text-xl text-antiqua-coal">{streak}{streak >= 2 ? "🔥" : ""}</div>
          <div className="text-[10px] text-antiqua-muted mt-0.5">Серия</div>
        </div>
      </div>

      {/* Lot card */}
      <div className="card mb-4">
        <div className="h-[180px] flex items-center justify-center text-[72px] relative" style={{ background: lot.bg }}>
          {lot.emoji}
          <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-medium">Лот {lot.lot}</div>
          <div className="absolute top-3 right-3 bg-antiqua-coal text-antiqua-gold text-[10px] px-2.5 py-1 rounded-full font-semibold">{lot.auction}</div>
        </div>
        <div className="p-4">
          <h2 className="font-display font-bold text-[18px] text-antiqua-coal mb-1.5 leading-tight">{lot.name}</h2>
          <p className="text-[11px] text-antiqua-muted leading-relaxed mb-3">{lot.desc}</p>
          <p className="text-sm font-medium text-antiqua-coal mb-3">Какова была финальная цена?</p>
          <div className="grid grid-cols-2 gap-2">
            {choices.map((price, i) => {
              const isThis = chosen === price;
              const isRight = price === lot.correct;
              return (
                <button key={i} disabled={answered} onClick={() => answer(price)}
                  className={cn("py-3 px-2 rounded-xl border font-display font-bold text-[15px] transition-all active:scale-[0.98]",
                    answered && isRight ? "bg-green-50 border-green-400 text-green-700" :
                    answered && isThis && !isRight ? "bg-red-50 border-red-300 text-red-700" :
                    answered ? "bg-antiqua-surface border-antiqua-border text-antiqua-muted" :
                    "bg-antiqua-surface border-antiqua-border text-antiqua-coal hover:border-antiqua-gold hover:bg-amber-50/50"
                  )}>
                  {formatPrice(price, lot.currency)}
                </button>
              );
            })}
          </div>

          {/* Reveal */}
          {answered && (
            <div className={cn("mt-3 p-3 rounded-xl border text-sm leading-relaxed", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
              <p className="font-semibold mb-1">
                {isCorrect ? `Верно! +${streak >= 3 ? "200 (серия ×"+streak+")" : "100"} очков` : `Цена была ${formatPrice(lot.correct, lot.currency)}`}
              </p>
              <p className="text-[11px] opacity-80">{lot.fact}</p>
            </div>
          )}
        </div>
      </div>

      {answered && (
        <button onClick={next} className="btn-primary">
          {cur + 1 >= LOTS.length ? "Завершить игру" : "Следующий лот →"}
        </button>
      )}
    </div>
  );
}
