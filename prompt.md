# ROLE

You are a senior staff-level engineer and product designer building a premium AI-powered Mahjong web application called:

# "Mahjoom"

This is NOT a classic Mahjong clone.

The product should feel like:
- Apple-level premium UX
- AI-assisted focus experience
- cinematic puzzle ritual
- emotionally immersive web app
- startup-quality product demo

The final result must look production-ready, polished, modern, animated, responsive, and memorable.

The project must be implemented using:

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Zustand
- Supabase
- Groq API
- Vercel deployment-ready architecture

The UI/UX quality should feel closer to:
- Monument Valley
- Headspace
- Arc Browser
- Apple Fitness
- Linear
- Calm

DO NOT create:
- casino-style Mahjong
- old-fashioned Chinese game UI
- generic game clone
- ugly gradients
- cheap mobile game aesthetics

The product should feel:
- calm
- premium
- intelligent
- atmospheric
- emotionally adaptive

---

# CORE PRODUCT IDEA

Mahjoom is an AI-powered mindful Mahjong experience.

Players choose a mood before starting:

- Focus
- Relax
- Deep Work
- Anxiety Reset
- Creative Flow
- Night Wind-down

The game dynamically adapts:
- colors
- animations
- music atmosphere
- AI coaching tone
- board complexity
- pacing

The AI acts like an intelligent strategic companion.

Instead of saying:
> "Match these tiles"

The AI says:
- "Opening the upper layer may reduce future block risk."
- "You're clearing aggressively from the center."
- "This move creates a dead-end possibility."

The AI should feel:
- observant
- calm
- insightful
- emotionally aware
- non-intrusive

---

# PROJECT GOALS

Build a fully functional premium prototype with:

## REQUIRED FEATURES

### 1. REAL MAHJONG SOLITAIRE ENGINE
Implement:
- valid tile matching
- free tile detection
- layer-based logic
- solvable board generation
- undo
- reshuffle
- hint system
- win/lose detection

The engine must NOT allow impossible boards.

Create a board solvability system.

IMPORTANT:
Most Mahjong clones fail here.
This is one of the main technical differentiators.

---

### 2. DAILY CHALLENGE SYSTEM

Create:
- one global daily board
- same seed for all players
- leaderboard
- completion time tracking
- streak system

Daily challenge should feel prestigious.

---

### 3. AI COACH (Groq API)

Use Groq API for:
- strategic hints
- player behavior analysis
- end-of-game summaries
- emotional reflections

Example outputs:
- "You solve boards by exposing structure early."
- "Your last 10 moves were highly efficient."
- "You tend to rush when only a few pairs remain."

The AI must NOT hallucinate game state.

Provide game state context in prompts.

Use streaming responses where possible.

---

### 4. MOOD SYSTEM

Each mood changes:
- gradients
- lighting
- animations
- particle intensity
- AI personality
- soundtrack metadata
- tile glow

Mood examples:

## Focus
- cool blue
- minimal UI
- low distraction
- analytical AI tone

## Relax
- warm ambient gradients
- softer transitions
- slower animations

## Creative Flow
- vivid colors
- dynamic particles
- playful AI commentary

---

### 5. PREMIUM CINEMATIC UX

Implement:
- smooth page transitions
- ambient animated backgrounds
- subtle parallax
- hover lighting
- depth shadows
- animated tile interactions
- glassmorphism panels
- magnetic buttons
- smooth easing curves

Animations should feel:
- expensive
- intentional
- fluid

Use Framer Motion heavily.

Avoid excessive bounce animations.

---

### 6. PLAYER ANALYTICS

Track:
- games played
- average completion time
- move efficiency
- hint usage
- win streaks
- preferred moods

Generate AI personality archetypes:
- Strategic Explorer
- Layer Thinker
- Fast Pattern Hunter
- Calm Solver

---

### 7. SOCIAL LAYER

Create:
- global leaderboard
- city leaderboard
- country leaderboard
- streak rankings

Supabase should store:
- player city
- player country
- scores
- daily challenge results

---

### 8. BUSINESS THINKING

Add:
- "Upgrade to Pro" UI
- locked premium themes
- locked AI personalities
- premium worlds

DO NOT implement payments fully unless easy.
The goal is startup thinking.

---

# TECH STACK

Use:

## Frontend
- Next.js 15
- React Server Components
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Zustand

## Backend
- Supabase
- PostgreSQL
- Edge Functions if needed

## AI
- Groq SDK

## Deployment
- Vercel-ready

---

# FOLDER STRUCTURE

Create scalable architecture:

```txt
/app
  /(marketing)
  /(game)
  /api
/components
  /ui
  /game
  /layout
  /effects
/core
  /mahjong
    board.ts
    rules.ts
    generator.ts
    solvability.ts
    evaluator.ts
    tiles.ts
/lib
  /supabase
  /groq
  /utils
/store
/hooks
/styles
/types
```

---

# GAME ENGINE REQUIREMENTS

Implement a professional Mahjong Solitaire engine.

## TILE RULES

A tile is selectable only if:
- no tile is above it
- at least one left/right side is free

Implement:
- matching logic
- selection logic
- tile states
- animation states

---

# BOARD GENERATION

IMPORTANT:
Generate SOLVABLE boards only.

Implement:
- seeded random generation
- deterministic daily boards
- difficulty scaling
- solvability validation

Difficulty factors:
- layer depth
- hidden pair count
- branching options
- dead-end probability

---

# GAMEPLAY FEEL

The game should feel:
- meditative
- intelligent
- cinematic
- tactile

Tile interactions:
- glow on hover
- depth movement
- soft snapping
- particle bursts
- smooth removal transitions

---

# AI SYSTEM DESIGN

Create AI utilities:

```txt
/lib/groq
  coach.ts
  summaries.ts
  prompts.ts
```

---

# AI PROMPTING STRATEGY

The AI should receive:
- current board state
- remaining moves
- exposed layers
- recent player actions
- elapsed time
- hint usage

The AI must produce:
- strategic observations
- psychological commentary
- coaching insights

The tone should be:
- calm
- premium
- emotionally intelligent

NEVER:
- robotic
- meme-like
- cringe
- overexcited

---

# DATABASE SCHEMA

Use Supabase.

Create SQL schema.

## users

```sql
id uuid primary key
username text
avatar_url text
country text
city text
created_at timestamp
```

## runs

```sql
id uuid primary key
user_id uuid
board_seed text
mood text
duration integer
moves integer
mistakes integer
won boolean
created_at timestamp
```

## daily_challenges

```sql
id uuid primary key
date date
seed text
theme text
difficulty integer
```

## leaderboard

```sql
id uuid primary key
user_id uuid
score integer
country text
city text
created_at timestamp
```

## ai_sessions

```sql
id uuid primary key
user_id uuid
coaching_style text
personality text
summary text
created_at timestamp
```

---

# UI PAGES

Implement:

## Landing Page
- cinematic hero
- animated gradients
- floating tiles
- CTA
- mood preview
- AI coach preview

## Game Screen
- immersive layout
- timer
- AI coach sidebar
- board
- stats
- controls

## Results Screen
- animated statistics
- AI reflection
- streak updates
- share card

## Profile
- analytics
- mood history
- achievements
- archetype

## Leaderboard
- global
- country
- city
- daily rankings

---

# VISUAL DESIGN SYSTEM

Typography:
- modern sans-serif
- minimal
- elegant

Spacing:
- generous whitespace

Style:
- glassmorphism
- blurred panels
- layered lighting
- cinematic gradients

DO NOT:
- overcrowd UI
- use harsh colors
- use neon gamer aesthetics

---

# PERFORMANCE REQUIREMENTS

The app must:
- load fast
- animate smoothly
- support mobile
- support desktop
- avoid unnecessary rerenders

Use:
- memoization
- lazy loading
- optimized animation strategies

---

# RESPONSIVENESS

Mobile experience is critical.

The game must work beautifully on:
- phones
- tablets
- desktop

Prioritize:
- touch interactions
- adaptive layouts
- fluid sizing

---

# ACCESSIBILITY

Implement:
- keyboard support
- reduced motion mode
- proper contrast
- semantic HTML

---

# IMPLEMENTATION ORDER

Follow EXACTLY this implementation sequence:

## PHASE 1 — FOUNDATION
1. Setup Next.js project
2. Configure Tailwind
3. Configure shadcn/ui
4. Configure Supabase
5. Configure Groq SDK
6. Setup global theme system
7. Setup Zustand stores

---

## PHASE 2 — GAME ENGINE
1. Tile system
2. Board data structure
3. Matching rules
4. Tile availability logic
5. Selection system
6. Win/loss detection
7. Undo system
8. Reshuffle system

---

## PHASE 3 — SOLVABLE GENERATOR
1. Seeded generation
2. Pair placement logic
3. Solvability validation
4. Difficulty scaling
5. Daily seed generation

---

## PHASE 4 — UI/UX
1. Board rendering
2. Tile animations
3. Ambient effects
4. Mood system
5. Responsive layouts
6. Page transitions

---

## PHASE 5 — AI FEATURES
1. AI coach prompts
2. Hint analysis
3. End-game summaries
4. Player archetypes
5. Streaming responses

---

## PHASE 6 — BACKEND
1. Auth
2. Save progress
3. Leaderboards
4. Daily challenges
5. Analytics

---

## PHASE 7 — POLISH
1. Sound integration
2. Microinteractions
3. Loading states
4. Skeletons
5. Empty states
6. Share cards
7. Premium upgrade UI

---

# CODE QUALITY RULES

Write:
- modular code
- reusable components
- clean TypeScript types
- scalable architecture
- production-quality patterns

Avoid:
- spaghetti code
- giant components
- duplicated logic
- inline styles

---

# EXPECTED OUTPUT

Generate:
- complete production-ready code
- reusable architecture
- polished UI
- animations
- Supabase integration
- Groq integration
- responsive design
- comments where useful

The final project should feel:
- startup-grade
- emotionally immersive
- visually unforgettable
- technically impressive

This is NOT a coding exercise.

This is a premium product experience.