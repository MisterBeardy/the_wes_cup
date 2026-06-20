# 🍺 The Wes Cup — Next.js

World Cup 2026 live drinking game. Every time a team wins, drink their national shot.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **`/api/scores`** — server-side score fetching with 60s revalidation

## Project structure

```
app/
  page.tsx              ← root page
  layout.tsx            ← fonts, metadata
  globals.css
  api/scores/route.ts   ← live scores API endpoint
components/
  GamePage.tsx          ← main client component (all state lives here)
  ScorePanel.tsx        ← Today / Upcoming tabs
  TeamCard.tsx          ← individual team card
  DrinkLink.tsx         ← drink name linked to Wikipedia
lib/
  teams.ts              ← all 48 teams, drinks, wiki links
  types.ts              ← TypeScript interfaces
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Live scores

The `/api/scores` route works in two modes:

**Without an API key** — returns baked-in fallback scores (updated manually).

**With a SportRadar key** — fetches real live scores, cached for 60 seconds.

```bash
cp .env.example .env.local
# Add your SPORTRADAR_API_KEY
```

Get a free trial key at https://developer.sportradar.com

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set `SPORTRADAR_API_KEY` in Vercel environment variables for live scores.

## Deploy to VPS (Nginx)

```bash
npm run build
npm start  # runs on port 3000
```

```nginx
server {
    listen 80;
    server_name wescupworldcupdrinks.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Features

- Live scores via server API route (60s cache)
- Auto-highlights winning teams in gold
- Authentic vs American Bar drink toggle
- Wikipedia links on every drink name
- Today's results + upcoming games panel
- Group filters A-L + search
- Drink tracker persisted in localStorage
- Fully responsive / mobile-first
