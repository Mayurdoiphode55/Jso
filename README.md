# JSO — Candidate Experience Agent

AI-powered feedback intelligence system for the JSO career platform. Built with Next.js 14, Supabase, Tailwind CSS, and Groq AI.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key

# 3. Run the SQL migration in Supabase SQL editor
# → Open supabase/migration.sql → Run in Supabase Dashboard SQL editor

# 4. Create auth users in Supabase Dashboard (Authentication > Users):
#    candidate1@jso.demo / demo123
#    consultant1@jso.demo / demo123
#    admin@jso.demo / demo123
#    licensing@jso.demo / demo123

# 5. Update UUIDs in seed.sql to match auth user IDs, then run seed.sql

# 6. Start the dev server
npm run dev

# 7. Deploy to Vercel
vercel --prod
```

## Supabase Setup Checklist

- [ ] Create a new Supabase project
- [ ] Run `supabase/migration.sql` in SQL editor (creates 4 tables + RLS policies)
- [ ] Enable Row Level Security (auto-enabled by migration)
- [ ] Create auth users matching the demo emails above
- [ ] Copy user UUIDs to `supabase/seed.sql` and run it
- [ ] Copy project URL and anon key to `.env.local`
- [ ] Enable Realtime for `surveys` and `alerts` tables

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Candidate | candidate1@jso.demo | demo123 |
| HR Consultant | consultant1@jso.demo | demo123 |
| Super Admin | admin@jso.demo | demo123 |
| Licensing | licensing@jso.demo | demo123 |

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + Tailwind CSS
- **AI**: Groq API — LLaMA 3.1 8B Instant (sentiment analysis)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready
