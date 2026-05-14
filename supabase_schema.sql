-- ============================================
-- Mahjoom — Database Schema (Supabase)
-- ============================================

-- 1. Users Table (Extension of Auth)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  country text,
  city text,
  archetype text,
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
  won boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Leaderboard Table
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  score integer not null,
  time integer not null, -- duration in seconds
  country text,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Function: Update Leaderboard on Win
-- This is called whenever a new run is inserted
create or replace function public.update_leaderboard_on_win()
returns trigger as $$
declare
  user_country text;
  user_city text;
  current_best_score integer;
begin
  -- Only process won games
  if new.won = true then
    -- Get user location
    select country, city into user_country, user_city from public.users where id = new.user_id;

    -- Calculate score (example: base 10000 - time penalty + move bonus)
    -- This can be adjusted to match your game's scoring logic
    -- For now, let's assume score is passed or calculated here
    -- Let's use a simple formula for the leaderboard: (Moves * 10) - (Duration)
    -- Actually, let's just use the score if we add a score column to runs
    
    -- Check if user already has a better score
    select max(score) into current_best_score from public.leaderboard where user_id = new.user_id;

    if current_best_score is null or (new.moves * 50) > current_best_score then
      -- Insert or update
      insert into public.leaderboard (user_id, score, time, country, city)
      values (new.user_id, (new.moves * 50), new.duration, user_country, user_city)
      on conflict (id) do update set 
        score = excluded.score,
        time = excluded.time;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for leaderboard
drop trigger if exists on_run_inserted on public.runs;
create trigger on_run_inserted
  after insert on public.runs
  for each row execute procedure public.update_leaderboard_on_win();

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

-- Policies (Safe re-run)
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

-- 7. Triggers for User Profiles
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
