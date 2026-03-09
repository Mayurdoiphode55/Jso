-- =============================================
-- JSO Candidate Experience Agent — Seed Data
-- =============================================
-- Mapped to the 4 auth users created in Supabase:
--   candidate1@jso.demo  → 90b6ad47-ff39-4bfc-8b57-5f74142fdd86
--   consultant1@jso.demo → f521a2b0-a51b-4822-af52-999782d78431
--   admin@jso.demo       → 9d35ad5d-855e-4280-aa98-d648700672c7
--   licensing@jso.demo   → 394ba7e7-ef41-4ef7-a975-c98ac9f9d458

-- =============================================
-- Profiles
-- =============================================
insert into profiles (id, full_name, role) values
  ('90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'Priya Sharma', 'candidate'),
  ('f521a2b0-a51b-4822-af52-999782d78431', 'Rahul Verma', 'hr_consultant'),
  ('9d35ad5d-855e-4280-aa98-d648700672c7', 'Admin User', 'super_admin'),
  ('394ba7e7-ef41-4ef7-a975-c98ac9f9d458', 'Licensing User', 'licensing');

-- =============================================
-- Sessions (6 completed between Priya and Rahul)
-- =============================================
insert into sessions (id, candidate_id, consultant_id, session_date, status) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', now() - interval '14 days', 'completed'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', now() - interval '10 days', 'completed'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', now() - interval '8 days', 'completed'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', now() - interval '6 days', 'completed'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', now() - interval '4 days', 'completed'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', now() - interval '2 days', 'completed');

-- =============================================
-- Surveys (4 responses with varying scores)
-- =============================================

-- Great review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('aaa11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', 5, 'Rahul was extremely helpful with my resume. He gave very specific advice on how to tailor it for product management roles. Highly recommend!', 'positive', '["excellent resume advice", "specific PM guidance"]', 9, false);

-- Poor review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('bbb22222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', 2, 'The session felt rushed and the advice was too generic. When I asked about salary negotiation, my question was dismissed entirely. Very disappointed.', 'negative', '["felt rushed", "generic advice", "salary question dismissed"]', 3, true);

-- Average review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('ccc33333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', 3, 'The session was okay. Got some useful tips but felt a bit rushed towards the end. Would have liked more time for questions.', 'neutral', '["felt rushed", "limited question time"]', 5, true);

-- Good review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('ddd44444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '90b6ad47-ff39-4bfc-8b57-5f74142fdd86', 'f521a2b0-a51b-4822-af52-999782d78431', 4, 'Good career path guidance today. Helped me understand the differences between data science and ML engineering roles. Quite informative overall.', 'positive', '["good career guidance", "role comparison helpful"]', 8, false);

-- =============================================
-- Alerts (1 unresolved for the low-score session)
-- =============================================
insert into alerts (id, survey_id, consultant_id, message, resolved) values
  ('a1e00111-1111-1111-1111-111111111111', 'bbb22222-2222-2222-2222-222222222222', 'f521a2b0-a51b-4822-af52-999782d78431', 'Low satisfaction score (3/10) detected for Rahul Verma. Key issues: felt rushed, generic advice, salary question dismissed', false);
