# Spotify Listening Personality

Connect your Spotify account to analyze your listening history via the Spotify Web API — surfaces top genres, mood/energy profiles, and listening patterns into a shareable personality breakdown. Built with Next.js 14, NextAuth.js, Supabase (PostgreSQL), and deployed on Vercel.

## Features

- **Spotify OAuth** — login with Spotify, sessions stored as encrypted JWTs with automatic token refresh
- **Personality analysis** — top genres, mood/energy/danceability/acousticness profile, listening time heatmap, 10 personality archetypes
- **Dashboard** — radar chart, genre bars, 24h×7d listening heatmap, top artists and tracks
- **Shareable profiles** — public URL at `/profile/[slug]`, OG image for social previews
- **Download card** — Wrapped-style 540×960 PNG card via `html-to-image`

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth.js with Spotify provider |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Deploy | Vercel |

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd spotify-listening-personality
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `SPOTIFY_CLIENT_ID` | [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Spotify Developer Dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |

### 3. Spotify app configuration

In your Spotify Developer Dashboard app settings, add these Redirect URIs:

```
http://localhost:3000/api/auth/callback/spotify
https://<your-vercel-domain>/api/auth/callback/spotify
```

Required scopes (set automatically): `user-read-email user-top-read user-read-recently-played`

### 4. Supabase database

Run the schema in `supabase/schema.sql` via the Supabase SQL editor to create all tables and indexes.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.example` in Vercel project settings
4. Set `NEXTAUTH_URL` to your production domain (e.g. `https://your-app.vercel.app`)
5. Generate a fresh `NEXTAUTH_SECRET` for production (`openssl rand -base64 32`)
6. In Supabase, enable connection pooling and append `?pgbouncer=true` to the database URL if using direct connections

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/          POST — run analysis pipeline
│   │   ├── auth/[...nextauth] NextAuth handler
│   │   ├── og/[slug]/        OG image (edge)
│   │   ├── profile/[slug]/   Public analysis data
│   │   └── user/analysis/    GET latest + PATCH visibility
│   ├── dashboard/            Protected user dashboard
│   └── profile/[slug]/       Public shareable profile
├── components/
│   ├── dashboard/            Chart + display components
│   ├── ShareCard.tsx         Downloadable card layout
│   └── DownloadCardButton.tsx html-to-image capture
├── lib/
│   ├── auth.ts               NextAuth config
│   ├── env.ts                Zod env validation
│   ├── db/queries.ts         Supabase query helpers
│   └── spotify/
│       ├── fetchers.ts       Spotify API wrappers
│       └── analyzer.ts       Analysis + archetype engine
└── types/
    ├── spotify.ts            Spotify API types
    └── next-auth.d.ts        Session type augmentation
```

## Personality Archetypes

The analysis engine maps your mood profile + top genres to one of 10 archetypes deterministically — no LLM required:

| Archetype | Signal |
|---|---|
| The Midnight Dreamer | Low energy + low valence + ambient/lo-fi genres |
| The Hype Machine | High energy + high valence + high danceability |
| The Deep Thinker | Acoustic + low valence + folk/singer-songwriter |
| The Genre Explorer | 4+ distinct genre parent categories |
| The Nostalgia Seeker | Classic rock / soul / oldies genres |
| The Dance Floor Architect | High danceability + high energy |
| The Lone Wolf | High instrumentalness + low energy |
| The Intensity Chaser | High energy + low valence |
| The Sunshine Curator | High valence + moderate energy |
| The Balanced Listener | Fallback |
