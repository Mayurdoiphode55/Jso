-- =============================================
-- JSO Candidate Experience Agent — Database Migration
-- =============================================

-- 1. Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('candidate', 'hr_consultant', 'super_admin', 'licensing')),
  created_at timestamp with time zone default now()
);

-- 2. Consultation sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references profiles(id) on delete cascade,
  consultant_id uuid references profiles(id) on delete cascade,
  session_date timestamp with time zone default now(),
  status text check (status in ('scheduled', 'completed', 'cancelled')) default 'scheduled',
  created_at timestamp with time zone default now()
);

-- 3. Satisfaction surveys
create table if not exists surveys (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  candidate_id uuid references profiles(id) on delete cascade,
  consultant_id uuid references profiles(id) on delete cascade,
  star_rating integer check (star_rating between 1 and 5),
  comment text,
  ai_sentiment text,
  ai_key_issues text,
  satisfaction_score integer check (satisfaction_score between 1 and 10),
  flagged boolean default false,
  created_at timestamp with time zone default now()
);

-- 4. Alerts for super admin
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id) on delete cascade,
  consultant_id uuid references profiles(id) on delete cascade,
  message text,
  resolved boolean default false,
  created_at timestamp with time zone default now()
);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table surveys enable row level security;
alter table alerts enable row level security;

-- PROFILES policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('super_admin', 'licensing')
    )
  );

create policy "HR consultants can view candidate profiles for their sessions"
  on profiles for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'hr_consultant'
    )
  );

-- SESSIONS policies
create policy "Candidates can view own sessions"
  on sessions for select
  using (candidate_id = auth.uid());

create policy "Consultants can view own sessions"
  on sessions for select
  using (consultant_id = auth.uid());

create policy "Admins can view all sessions"
  on sessions for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('super_admin', 'licensing')
    )
  );

create policy "Admins can update sessions"
  on sessions for update
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'super_admin'
    )
  );

create policy "Candidates can insert sessions"
  on sessions for insert
  with check (candidate_id = auth.uid());

-- SURVEYS policies
create policy "Candidates can view own surveys"
  on surveys for select
  using (candidate_id = auth.uid());

create policy "Candidates can insert own surveys"
  on surveys for insert
  with check (candidate_id = auth.uid());

create policy "Consultants can view surveys for their sessions"
  on surveys for select
  using (consultant_id = auth.uid());

create policy "Admins can view all surveys"
  on surveys for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('super_admin', 'licensing')
    )
  );

create policy "Service role can update surveys"
  on surveys for update
  using (true);

-- ALERTS policies
create policy "Admins can view all alerts"
  on alerts for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role in ('super_admin', 'licensing')
    )
  );

create policy "Admins can update alerts"
  on alerts for update
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'super_admin'
    )
  );

create policy "Consultants can view own alerts"
  on alerts for select
  using (consultant_id = auth.uid());

create policy "Service role can insert alerts"
  on alerts for insert
  with check (true);

-- Enable realtime on surveys and alerts tables
alter publication supabase_realtime add table surveys;
alter publication supabase_realtime add table alerts;
