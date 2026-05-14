-- ============================================
-- Mahjoom — Database Schema (Supabase)
-- Optimized for Global Rankings & Persistent Profiles
-- ============================================

-- 1. Users Table (Extension of Auth)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  country text,
  city text,
  archetype text,
  total_score bigint default 0,
  games_played integer default 0,
  best_time integer, -- best duration for a win
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Game Runs Table
create table if not exists public.runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete set null,
  board_seed text not null,
  mood text not null,
  duration integer not null, -- in seconds
  moves integer not null,
  hints_used integer default 0,
  score integer not null default 0,
  won boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Global Leaderboard Table
-- This stores the BEST record for each user to keep rankings clean
create table if not exists public.leaderboard (
  user_id uuid references public.users on delete cascade primary key,
  username text not null,
  score bigint not null,
  time integer not null,
  country text,
  city text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Function: Process Game Run & Update Stats/Leaderboard
create or replace function public.process_game_run()
returns trigger as $$
declare
  u_username text;
  u_country text;
  u_city text;
begin
  -- 1. Update User Global Stats
  update public.users
  set 
    total_score = total_score + new.score,
    games_played = games_played + 1,
    best_time = case 
      when new.won = true and (best_time is null or new.duration < best_time) then new.duration 
      else best_time 
    end
  where id = new.user_id;

  -- 2. Update Leaderboard (Store only the best score per user)
  if new.user_id is not null then
    select username, country, city into u_username, u_country, u_city 
    from public.users where id = new.user_id;

    insert into public.leaderboard (user_id, username, score, time, country, city, updated_at)
    values (new.user_id, u_username, new.score, new.duration, u_country, u_city, now())
    on conflict (user_id) do update set
      score = case when excluded.score > public.leaderboard.score then excluded.score else public.leaderboard.score end,
      time = case when excluded.score > public.leaderboard.score then excluded.time else public.leaderboard.time end,
      updated_at = now();
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for runs
drop trigger if exists on_run_inserted on public.runs;
create trigger on_run_inserted
  after insert on public.runs
  for each row execute procedure public.process_game_run();

-- 5. Daily Challenges Table
create table if not exists public.daily_challenges (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,
  seed text not null,
  theme text,
  difficulty integer default 2
);

-- 6. Enable RLS
alter table public.users enable row level security;
alter table public.runs enable row level security;
alter table public.leaderboard enable row level security;
alter table public.daily_challenges enable row level security;

-- Policies
do $$ 
begin
  drop policy if exists "Public profiles are viewable by everyone." on public.users;
  drop policy if exists "Users can update their own profile." on public.users;
  drop policy if exists "Runs are viewable by everyone." on public.runs;
  drop policy if exists "Users can insert their own runs." on public.runs;
  drop policy if exists "Leaderboard is viewable by everyone." on public.leaderboard;
  drop policy if exists "Daily challenges are viewable by everyone." on public.daily_challenges;
end $$;

create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can update their own profile." on public.users for update using (auth.uid() = id);
create policy "Runs are viewable by everyone." on public.runs for select using (true);
create policy "Users can insert their own runs." on public.runs for insert with check (auth.uid() = user_id or user_id is null);
create policy "Leaderboard is viewable by everyone." on public.leaderboard for select using (true);
create policy "Daily challenges are viewable by everyone." on public.daily_challenges for select using (true);

-- 7. Trigger for User Profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
