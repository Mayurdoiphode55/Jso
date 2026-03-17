-- =============================================
-- JSO Candidate Experience Agent — Auto-Onboarding
-- =============================================

-- 1. Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'candidate' -- Default role for new signups
  );
  return new;
end;
$$;

-- 2. Trigger to execute the function on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. (Optional) Retroactively create profiles for existing auth users who don't have one
insert into public.profiles (id, full_name, role)
select 
  id, 
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  'candidate'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;
