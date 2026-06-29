# Antiqua PWA

Приложение для оценки антиквариата по реальным аукционным данным.

## Быстрый старт — 5 шагов

### Шаг 1 — Установить Node.js
Если нет: [nodejs.org](https://nodejs.org) → скачать LTS → установить

### Шаг 2 — Установить зависимости
```bash
npm install
```

### Шаг 3 — Создать .env.local
```bash
cp .env.example .env.local
```
Открыть `.env.local` и заполнить минимум для старта:
- `ANTHROPIC_API_KEY` — получить на console.anthropic.com

### Шаг 4 — Создать иконки PWA
Зайти на [realfavicongenerator.net](https://realfavicongenerator.net)
Загрузить логотип (лупа), фон #1C1812, иконка #D4A843
Скачать архив → положить в `public/icons/`:
- icon-192.png
- icon-512.png

### Шаг 5 — Запустить
```bash
npm run dev
```
Открыть [http://localhost:3000](http://localhost:3000)

---

## Деплой на Vercel (бесплатно)

```bash
npm i -g vercel
vercel
```

Или через GitHub:
1. Запушить на GitHub
2. vercel.com → Import Project
3. Добавить переменные из .env.example
4. Deploy → получить URL вида antiqua.vercel.app

---

## Структура

```
src/
  app/
    page.tsx          ← Главная
    layout.tsx        ← PWA мета, шрифты, навигация
    appraise/         ← Экран оценки (загрузка + результат)
    journal/          ← Журнал статей
    map/              ← Карта антикварных рынков
    game/             ← Игра «Угадай цену»
    api/appraise/     ← API пайплайн (Claude + eBay)
  components/
    layout/BottomNav  ← Нижняя навигация
    ui/InstallBanner  ← Баннер установки для iOS
  lib/utils.ts        ← Утилиты
public/
  manifest.json       ← PWA манифест
  icons/              ← Иконки (создать!)
```

---

## Как работает оценка

1. Пользователь загружает 1–5 фото + заполняет форму
2. Фото сжимаются до 1024px в браузере
3. Claude Vision (claude-sonnet-4-6) анализирует фото → JSON с описанием
4. eBay Finding API ищет похожие завершённые лоты
5. Считается скор уверенности (0–100%)
6. Claude синтезирует финальный отчёт с объяснением
7. Результат показывается пользователю

---

## Затраты на запуск

| Сервис | Стоимость |
|--------|-----------|
| Vercel | Бесплатно |
| Supabase | Бесплатно до 50K MAU |
| Anthropic API | ~€0.02/оценка |
| eBay API | Бесплатно |
| Mapbox | Бесплатно до 50K загрузок |
| **Итого** | **~€20/мес** |
