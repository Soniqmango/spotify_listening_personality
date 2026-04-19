-- Run this in the Supabase SQL editor to create all tables

create table if not exists users (
  id           uuid primary key default gen_random_uuid(),
  spotify_id   text unique not null,
  display_name text,
  avatar_url   text,
  email        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists analyses (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references users(id) on delete cascade,
  spotify_id           text not null,
  analyzed_at          timestamptz default now(),
  top_genres           text[],
  top_artist_names     text[],
  top_artist_ids       text[],
  avg_energy           numeric(4,3),
  avg_valence          numeric(4,3),
  avg_danceability     numeric(4,3),
  avg_tempo            numeric(6,2),
  avg_acousticness     numeric(4,3),
  avg_instrumentalness numeric(4,3),
  peak_hour            smallint,
  peak_day_of_week     smallint,
  listening_heatmap    jsonb,
  genre_counts         jsonb,
  personality_label    text,
  personality_bio      text,
  share_slug           text unique,
  is_public            boolean default true
);

create table if not exists top_tracks (
  id           uuid primary key default gen_random_uuid(),
  analysis_id  uuid references analyses(id) on delete cascade,
  spotify_id   text not null,
  track_name   text,
  artist_name  text,
  album_name   text,
  album_art    text,
  preview_url  text,
  energy       numeric(4,3),
  valence      numeric(4,3),
  danceability numeric(4,3),
  tempo        numeric(6,2),
  rank         smallint
);

-- Indexes for common lookups
create index if not exists analyses_spotify_id_idx on analyses(spotify_id);
create index if not exists analyses_share_slug_idx on analyses(share_slug);
create index if not exists top_tracks_analysis_id_idx on top_tracks(analysis_id);
