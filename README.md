# 🀄 Mahjoom

**A Sanctuary for your Senses.**  
Премиальное AI-приложение для игры в маджонг-пасьянс, созданное для глубокого фокуса и медитативного геймплея.

![Version](https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![AI-Powered](https://img.shields.io/badge/AI-Groq%20Coach-orange?style=for-the-badge&logo=openai)

---

## ✨ Ключевые возможности

*   🧠 **AI Strategic Coach** — Интеграция с Groq API для предоставления контекстных советов, анализа стиля игры и эмоциональной поддержки.
*   🎭 **Mood-Adaptive System** — Динамическая смена тем (Focus, Relax, Creative Flow и др.), влияющая на цветовую гамму, анимации и тон общения ИИ.
*   🧩 **Solvable Board Engine** — Уникальный алгоритм генерации, гарантирующий наличие решения для каждой раскладки.
*   📅 **Daily Zen Trials** — Ежедневные глобальные испытания с единым сидом для всех игроков и соревновательным элементом.
*   📈 **Deep Analytics** — Отслеживание прогресса, эффективности ходов и формирование психологического архетипа игрока (например, "Strategic Explorer").
*   ✨ **Premium UX** — Использование Framer Motion для "дорогих" анимаций, эффект стекломорфизма (glassmorphism) и кинематографичный интерфейс.

---

## 🚀 Быстрый старт

### Требования
*   Node.js 18+ 
*   Аккаунт Supabase
*   API Ключ Groq

### Установка

1.  Клонируйте репозиторий:
    ```bash
    git clone https://github.com/your-username/mahjoom.git
    cd mahjoom
    ```

2.  Установите зависимости:
    ```bash
    npm install
    ```

3.  Настройте переменные окружения:
    Создайте файл `.env.local` на основе `.env.local.example` и заполните ключи для Supabase и Groq.

4.  Запустите сервер разработки:
    ```bash
    npm run dev
    ```

---

## 🛠 Технологический стек

| Слой | Технологии |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS 4 |
| **State** | Zustand (Mood & Game state) |
| **Animations** | Framer Motion, Lucide Icons |
| **Backend** | Supabase (Auth, PostgreSQL, Realtime) |
| **AI** | Groq SDK (LLM-интеграция) |
| **UI Components** | shadcn/ui, Base UI |

---

## 📐 Архитектура и Логика

Проект следует модульной структуре для обеспечения масштабируемости:

*   **`core/mahjong/`** — Чистая логика игры:
    *   `generator.ts`: Алгоритм создания решаемых полей методом обратного хода.
    *   `solvability.ts`: Валидатор текущего состояния доски.
    *   `rules.ts`: Реализация классических правил маджонг-пасьянса.
*   **`store/`** — Реактивное состояние игры и настроения пользователя.
*   **`components/effects/`** — Визуальные компоненты: AmbientBackground, FloatingTiles и системы частиц.

> [!NOTE]
> Система настроения (Mood System) не просто меняет CSS-классы, а полностью пересчитывает параметры освещения, интенсивности частиц и даже системный промпт для AI-коуча.

---

## ✅ Соответствие ТЗ

Проект полностью реализует требования, заложенные в спецификации:
- [x] **Solvable Boards**: Реализован алгоритм проверки и генерации решаемых досок.
- [x] **AI Coach**: Полноценная интеграция с Groq для анализа поведения игрока.
- [x] **Social Layer**: Система лидербордов (Global, Country, City) через Supabase.
- [x] **Mood Rituals**: 6 предустановленных состояний с уникальным визуальным кодом.
- [x] **Premium UX**: Соответствие стандартам дизайна (Apple-level UX, Monument Valley aesthetics).

---

## 📄 Лицензия

Проект разработан в рамках концепции Premium Open Source. Подробности см. в файле [LICENSE](LICENSE) (если применимо).
