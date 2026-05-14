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
  time integer not null, -- duration
  country text,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Daily Challenges Table
create table if not exists public.daily_challenges (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,
  seed text not null,
  theme text,
  difficulty integer default 2
);

-- 5. Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.runs enable row level security;
alter table public.leaderboard enable row level security;
alter table public.daily_challenges enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can update their own profile." on public.users
  for update using (auth.uid() = id);

create policy "Runs are viewable by everyone." on public.runs
  for select using (true);

create policy "Users can insert their own runs." on public.runs
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "Leaderboard is viewable by everyone." on public.leaderboard
  for select using (true);

create policy "Daily challenges are viewable by everyone." on public.daily_challenges
  for select using (true);

-- 6. Trigger: Automatically create a user profile on signup
-- This ensures that every new Auth user gets a row in public.users
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

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
