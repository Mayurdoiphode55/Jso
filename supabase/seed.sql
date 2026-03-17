-- =============================================
-- JSO Candidate Experience Agent — Seed Data
-- =============================================
-- Mapped to the 4 auth users created in Supabase:
--   candidate1@jso.demo  → fefad7b4-1d9d-4865-aec6-9cc481063187
--   consultant1@jso.demo → 9429ee0f-a5e2-4392-b125-dc2363a3309b
--   admin@jso.demo       → 7d983228-083d-4313-8823-f9e20668d6cd
--   licensing@jso.demo   → 147f11eb-ad8a-45ba-8da3-80bf848ca7d9

-- =============================================
-- Profiles
-- =============================================
insert into profiles (id, full_name, role) values
  ('fefad7b4-1d9d-4865-aec6-9cc481063187', 'Priya Sharma', 'candidate'),
  ('9429ee0f-a5e2-4392-b125-dc2363a3309b', 'Rahul Verma', 'hr_consultant'),
  ('7d983228-083d-4313-8823-f9e20668d6cd', 'Admin User', 'super_admin'),
  ('147f11eb-ad8a-45ba-8da3-80bf848ca7d9', 'Licensing User', 'licensing');

-- =============================================
-- Sessions (6 completed between Priya and Rahul)
-- =============================================
insert into sessions (id, candidate_id, consultant_id, session_date, status) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', now() - interval '14 days', 'completed'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', now() - interval '10 days', 'completed'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', now() - interval '8 days', 'completed'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', now() - interval '6 days', 'completed'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', now() - interval '4 days', 'completed'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', now() - interval '2 days', 'completed');

-- =============================================
-- Surveys (4 responses with varying scores)
-- =============================================

-- Great review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('aaa11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', 5, 'Rahul was extremely helpful with my resume. He gave very specific advice on how to tailor it for product management roles. Highly recommend!', 'positive', '["excellent resume advice", "specific PM guidance"]', 9, false);

-- Poor review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('bbb22222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', 2, 'The session felt rushed and the advice was too generic. When I asked about salary negotiation, my question was dismissed entirely. Very disappointed.', 'negative', '["felt rushed", "generic advice", "salary question dismissed"]', 3, true);

-- Average review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('ccc33333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', 3, 'The session was okay. Got some useful tips but felt a bit rushed towards the end. Would have liked more time for questions.', 'neutral', '["felt rushed", "limited question time"]', 5, true);

-- Good review
insert into surveys (id, session_id, candidate_id, consultant_id, star_rating, comment, ai_sentiment, ai_key_issues, satisfaction_score, flagged) values
  ('ddd44444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'fefad7b4-1d9d-4865-aec6-9cc481063187', '9429ee0f-a5e2-4392-b125-dc2363a3309b', 4, 'Good career path guidance today. Helped me understand the differences between data science and ML engineering roles. Quite informative overall.', 'positive', '["good career guidance", "role comparison helpful"]', 8, false);

-- =============================================
-- Alerts (1 unresolved for the low-score session)
-- =============================================
insert into alerts (id, survey_id, consultant_id, message, resolved) values
  ('a1e00111-1111-1111-1111-111111111111', 'bbb22222-2222-2222-2222-222222222222', '9429ee0f-a5e2-4392-b125-dc2363a3309b', 'Low satisfaction score (3/10) detected for Rahul Verma. Key issues: felt rushed, generic advice, salary question dismissed', false);
