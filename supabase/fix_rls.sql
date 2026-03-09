-- =============================================
-- Fix RLS Policies — Drop old and create simpler ones
-- =============================================

-- Drop all existing policies
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "HR consultants can view candidate profiles for their sessions" on profiles;

drop policy if exists "Candidates can view own sessions" on sessions;
drop policy if exists "Consultants can view own sessions" on sessions;
drop policy if exists "Admins can view all sessions" on sessions;
drop policy if exists "Admins can update sessions" on sessions;
drop policy if exists "Candidates can insert sessions" on sessions;

drop policy if exists "Candidates can view own surveys" on surveys;
drop policy if exists "Candidates can insert own surveys" on surveys;
drop policy if exists "Consultants can view surveys for their sessions" on surveys;
drop policy if exists "Admins can view all surveys" on surveys;
drop policy if exists "Service role can update surveys" on surveys;

drop policy if exists "Admins can view all alerts" on alerts;
drop policy if exists "Admins can update alerts" on alerts;
drop policy if exists "Consultants can view own alerts" on alerts;
drop policy if exists "Service role can insert alerts" on alerts;

-- =============================================
-- New simplified policies — any authenticated user can read
-- =============================================

-- PROFILES: any logged-in user can read all profiles (needed for names)
create policy "Authenticated users can view profiles"
  on profiles for select
  to authenticated
  using (true);

-- SESSIONS: any logged-in user can read relevant sessions
create policy "Authenticated users can view sessions"
  on sessions for select
  to authenticated
  using (true);

-- SESSIONS: candidates can create sessions (for demo simulation)
create policy "Candidates can insert sessions"
  on sessions for insert
  to authenticated
  with check (true);

-- SURVEYS: any logged-in user can read surveys
create policy "Authenticated users can view surveys"
  on surveys for select
  to authenticated
  using (true);

-- SURVEYS: candidates can insert surveys
create policy "Candidates can insert surveys"
  on surveys for insert
  to authenticated
  with check (true);

-- SURVEYS: allow updates (for AI analysis results)
create policy "Allow survey updates"
  on surveys for update
  to authenticated
  using (true);

-- ALERTS: any logged-in user can read alerts
create policy "Authenticated users can view alerts"
  on alerts for select
  to authenticated
  using (true);

-- ALERTS: allow inserts (for auto-alert creation)
create policy "Allow alert inserts"
  on alerts for insert
  to authenticated
  with check (true);

-- ALERTS: allow updates (for resolving)
create policy "Allow alert updates"
  on alerts for update
  to authenticated
  using (true);
