# JSO Candidate Experience Agent — Assignment Answers

**Submitted by:** Mayur  
**Role Applied For:** Agentic AI Engineer Intern (Career Intelligence Systems)  
**Company:** AariyaTech Corp Private Limited  
**Platform:** JSO (Job Search Optimiser)

---

# PART A — WRITTEN ANSWERS

---

## Section 1: Why Agentic JSO

### Q1: Why does the JSO platform require AI Agents in Phase 2?

The JSO platform's Phase 1 architecture is built entirely on manual processes — human HR consultants conducting one-on-one sessions, manual scheduling, and subjective quality assessments. While this approach works at a small scale, it fundamentally cannot scale to serve the global job-seeking population that JSO's mission targets. When the platform grows from hundreds to tens of thousands of concurrent users across multiple time zones and languages, human-only operations become a bottleneck rather than a backbone.

AI agents solve this by operating 24/7 without fatigue, cognitive bias, or capacity constraints. A single AI agent can simultaneously process feedback from thousands of consultation sessions, detect patterns that human administrators would miss, and generate actionable insights in real time. For instance, a human admin reviewing consultation quality might read 10–15 feedback forms per day; an AI agent can analyse thousands within seconds, catching subtle sentiment shifts that indicate declining consultation quality before they become systemic problems.

JSO's core mission — solving the global job search problem — is only achievable at scale with AI. Personalised career guidance for thousands of users simultaneously requires intelligent automation that can adapt to each candidate's context, language, and needs. AI agents don't replace human consultants; they amplify them, handling repetitive analytical tasks so consultants can focus on what they do best — empathetic, personalised career guidance.

From a **Governance** perspective, AI agents bring unprecedented transparency and accountability to platform quality. Every agent decision is logged, every analysis is traceable, and every alert has a clear audit trail. This creates a governance framework where platform quality is not just aspirational but measurable and enforceable — something that pure manual operations can never achieve consistently at scale.

---

### Q2: What inefficiencies exist in the current Phase 1 system?

The current Phase 1 system has several critical inefficiencies that directly impact candidate outcomes and platform quality:

**No automated feedback collection.** After a consultation session ends, there is no systematic mechanism to capture the candidate's experience. Whether a session was transformative or deeply unsatisfying, the platform has zero visibility. Feedback, if it exists at all, is anecdotal and unstructured — perhaps a verbal comment or an email that never gets catalogued.

**No real-time quality monitoring.** Consultant performance is essentially a black box. There are no metrics, no dashboards, and no alerts. A consultant could deliver consistently poor sessions for weeks before anyone notices, by which time multiple candidates have had negative experiences and potentially abandoned the platform entirely.

**Zero admin visibility into consultation quality.** Super Admins and platform managers operate without data. They cannot identify which consultants are excelling, which need support, or which sessions are generating complaints. Decision-making about consultant assignments, training, and platform improvements is based on intuition rather than evidence.

**Manual, subjective consultant-candidate matching.** Without data-driven insights into consultant strengths and candidate needs, matching is essentially random or based on availability alone. This leads to mismatches — a candidate needing salary negotiation advice might be paired with a consultant who specialises in resume writing.

**No automated follow-up system.** After a session, candidates receive no check-in, no resources, and no nudge to book follow-ups. The candidate journey has gaps that reduce engagement and retention.

From a **Workers** pillar perspective, this lack of structured feedback is equally harmful to consultants. Without systematic performance data, HR consultants have no mechanism for professional growth. They cannot see what they're doing well, what candidates value, or where they need to improve. Feedback is a gift, and the current system denies consultants this essential growth tool.

---

### Q3: How can AI agents improve user experience and platform efficiency?

AI agents can transform the JSO platform from a reactive, manually-operated system into a proactive, intelligence-driven career platform. Here are the specific improvements:

**Automated post-session satisfaction surveys triggered instantly.** Within minutes of a consultation ending, the Candidate Experience Agent sends a short, focused survey to the candidate. This captures feedback while the experience is fresh, dramatically improving both response rates and feedback quality compared to delayed or manual collection methods.

**Sentiment analysis on feedback text to detect frustration or praise.** Using Groq's LLaMA 3.1 model, the agent goes beyond simple star ratings. It analyses free-text comments to detect nuanced emotions — frustration, confusion, gratitude, enthusiasm — and extracts specific issues like "salary question ignored" or "excellent resume advice." This transforms unstructured text into actionable intelligence.

**Real-time alerts to admins when quality drops.** The moment a consultation session receives a satisfaction score below the threshold, the Super Admin dashboard receives an automatic alert. This reduces response time from days or weeks (in manual systems) to seconds, enabling proactive intervention before negative patterns compound.

**Personalised nudges to candidates for follow-up bookings.** Based on session outcomes and satisfaction data, the agent can recommend follow-up sessions, suggest different consultants for specific needs, or provide tailored resources that address the candidate's particular career challenges.

**Trend reports helping consultants improve.** Weekly and monthly performance trends give consultants a clear picture of their trajectory. They can see which sessions were most valued, what common issues arise, and how their satisfaction scores compare over time. This data-driven feedback loop accelerates professional development.

From a **Community** pillar perspective, AI agents enable multilingual survey support, ensuring that candidates from diverse linguistic backgrounds can provide feedback in their preferred language. This inclusivity is essential for a global platform — a candidate in Japan should have the same quality feedback experience as one in India. By removing language barriers, AI agents ensure that the platform's quality improvement loop includes every voice, not just those comfortable in English.

---

## Section 2: Agent Design

### Q1: What type of AI agent should be built?

The Candidate Experience Agent (CEA) should be designed as a **Reactive + Goal-Oriented AI Agent**, combining event-driven responsiveness with strategic optimisation toward platform quality goals.

**Reactive Component:** The agent responds to specific events in real time. When a consultation session status changes to 'completed' in the database, the agent immediately triggers the survey workflow. When a candidate submits feedback, the agent instantly processes it through the AI analysis pipeline. When a satisfaction score falls below the threshold, the agent creates an alert without delay. This reactive behaviour ensures that no event goes unprocessed and that the feedback loop is as tight as possible.

**Goal-Oriented Component:** Beyond simply reacting to events, the CEA works toward a defined goal: maximising overall candidate satisfaction scores across the platform. It doesn't just collect and analyse feedback — it generates improvement suggestions for consultants, identifies systemic patterns across multiple sessions, and provides the data foundation for strategic decisions about consultant training and platform improvements. The agent's success is measured not just by the number of surveys processed, but by the trend direction of satisfaction scores over time.

The CEA uses **Groq's LLaMA 3.1 8B Instant model** for natural language understanding, enabling it to parse free-text feedback with nuance that simple keyword matching cannot achieve. The model identifies sentiment polarity (positive/neutral/negative), extracts specific key issues mentioned by candidates, and generates concise summaries that consultants and admins can act upon quickly.

From a **Governance** perspective, every decision the agent makes is fully logged and auditable. The AI analysis results (sentiment, key issues, scores) are stored alongside the raw feedback, creating a transparent chain from candidate comment to platform action. This means any alert, score, or recommendation can be traced back to its source, ensuring accountability and enabling quality audits of the agent itself.

---

### Q2: What tasks will this agent automate?

The Candidate Experience Agent automates six core tasks that collectively close the feedback-quality loop:

1. **Auto-send satisfaction survey after every session.** When a session is marked 'completed,' the agent triggers a short 3–5 question survey delivered to the candidate's dashboard. The survey is designed for speed — a star rating (1–5) plus an optional free-text comment — ensuring high completion rates without survey fatigue.

2. **Analyse free-text feedback with AI.** The candidate's comment is anonymised (names and emails stripped) and sent to Groq's LLaMA 3.1 8B model. The AI returns a structured analysis: sentiment classification (positive/neutral/negative), a sentiment score (−1.0 to 1.0), extracted key issues (e.g., "felt rushed," "excellent advice on LinkedIn"), and a one-sentence summary. This transforms unstructured text into structured, actionable data.

3. **Calculate satisfaction score (1–10).** The agent combines the candidate's star rating with the AI's sentiment analysis to produce a unified satisfaction score on a 1–10 scale. This blended approach ensures that the score reflects both the candidate's explicit rating and the implicit sentiment of their written feedback.

4. **Flag low-score sessions and create alerts.** Any session receiving a satisfaction score below 6/10 is automatically flagged. The agent creates an alert in the alerts table with details including the consultant's name, the score, and the key issues extracted by AI. This alert appears on the Super Admin dashboard for review and action.

5. **Generate weekly trend reports.** The agent aggregates satisfaction data across time periods, producing trend visualisations that show platform-wide and per-consultant performance trajectories. These reports enable data-driven decisions about consultant training, platform improvements, and quality standards.

6. **Recommend improvement areas to consultants.** Based on patterns in flagged sessions and AI-extracted key issues, the agent generates targeted improvement suggestions. If multiple candidates mention feeling "rushed," the consultant receives a specific tip about time management. This transforms raw feedback into professional development guidance.

---

### Q3: How will the agent interact with the existing dashboard?

The CEA integrates with all four JSO dashboards, providing role-appropriate data and actions:

**User (Candidate) Dashboard:**
After a session is marked complete, a post-session survey popup appears on the candidate's dashboard. The survey includes an interactive star rating component and an optional text comment field, along with a clear privacy notice: "Your feedback is anonymised before AI analysis." Candidates can also view their personal satisfaction history — a chronological list of their past sessions with the ratings they gave, providing transparency into their own feedback trail.

**HR Consultant Dashboard:**
Consultants see a real-time satisfaction score widget displaying their rolling average score as a large, colour-coded number (green ≥ 7, yellow 5–6, red < 5). A trend line chart shows their score trajectory over recent sessions. Below this, recent feedback entries display AI sentiment badges (positive/neutral/negative), AI-generated summaries, and extracted key issues as tags. Flagged sessions are highlighted with improvement tips derived from the AI analysis. Critically, from the **Workers** pillar perspective, this feedback is framed as a growth tool — "Here's how you can improve" — rather than punitive surveillance.

**Super Admin Dashboard:**
Admins see platform-wide metrics: average satisfaction score, total sessions, active alerts, and total surveys collected. A satisfaction trend chart provides macro-level quality visibility. A consultant leaderboard ranks consultants by satisfaction score, enabling quick identification of top performers and those needing support. An active alerts panel shows unresolved low-score flags, each with detail and a "Mark Resolved" action button. From a **Governance** perspective, the admin dashboard includes a full audit trail of all agent decisions — every score, every alert, every analysis is traceable.

**Licensing Dashboard:**
The licensing view shows aggregate-only metrics: platform average satisfaction score, total consultations, response rates, and compliance summaries. No individual candidate data is visible — privacy is structurally enforced at the dashboard level. These aggregate metrics are formatted for compliance reporting, showing that the platform meets quality thresholds required for licensing standards.

---

## Section 3: Problem Solving

### Q1: What specific problem does this agent solve?

The fundamental problem is the complete absence of a systematic mechanism to evaluate, monitor, and improve the quality of consultation sessions on the JSO platform. In Phase 1, consultation quality is invisible — there are no metrics, no feedback loops, and no automated quality assurance processes.

This invisibility has cascading consequences. **Poor consultants go undetected and uncorrected.** A consultant who consistently provides superficial advice, ignores candidate questions, or conducts rushed sessions faces no accountability because there is no system to capture or analyse candidate experiences. Without detection, there can be no correction, and without correction, quality deteriorates unchecked.

**Candidates leave with unresolved issues and don't return.** When a candidate has a poor session and has no mechanism to voice their dissatisfaction, their only recourse is to disengage from the platform. The candidate leaves quietly — no feedback, no complaint, no data point — and JSO loses a user without ever understanding why. This silent churn is the most dangerous kind because it's entirely invisible to platform operators.

**JSO cannot improve service quality systematically.** Without quantitative quality data, platform improvements are based on guesswork. Questions like "Are our consultants meeting candidate needs?" or "Which areas of consultation need improvement?" are unanswerable because the data doesn't exist.

From the **Customers** pillar perspective, this represents a fundamental failure of candidate advocacy. Candidates — the core customers of JSO — currently have no voice in platform quality. Their experiences, whether positive or negative, disappear into a void. The Candidate Experience Agent solves this by giving candidates a structured, accessible channel to share their experiences and ensuring that every piece of feedback drives measurable action.

---

### Q2: Provide a real scenario showing how the agent improves the platform.

**Scenario: Priya's Consultation Experience**

Priya Sharma is a 26-year-old software developer from Pune seeking career transition advice. She books a consultation session with an HR consultant through the JSO platform.

During the 30-minute session, the consultant rushes through Priya's questions about career paths in product management, provides generic advice copied from online articles, and dismisses her question about salary negotiation with "just take whatever they offer for your first PM role." Priya leaves the session feeling unheard and frustrated — she paid for personalised guidance and received a generic, dismissive experience.

**In Phase 1 (current system):** Nothing happens. Priya's frustration is not captured anywhere. The consultant continues conducting sessions the same way. The Super Admin has no idea this happened. Priya considers cancelling her JSO subscription and tells two friends the platform "wasn't worth it." The consultant's poor behaviour is reinforced by the absence of consequences.

**In Phase 2 (with CEA):** Five minutes after the session ends, the Candidate Experience Agent detects the session status change to 'completed' and sends a satisfaction survey to Priya's dashboard. Priya rates the session 2 out of 5 stars and writes: "The consultant seemed rushed and gave generic advice I could have found on Google. When I asked about salary negotiation for PM roles, he dismissed my question entirely. Very disappointed."

The CEA strips Priya's name and email from the comment text and sends it to the Groq LLaMA 3.1 API for analysis. The AI returns:
```json
{
  "sentiment": "negative",
  "key_issues": ["generic advice", "salary question dismissed", "felt rushed"],
  "sentiment_score": -0.78,
  "summary": "Candidate expressed strong dissatisfaction with rushed, generic consultation and dismissed salary negotiation inquiry."
}
```

The CEA calculates a satisfaction score of **3/10** (combining the 2/5 star rating with the −0.78 sentiment score). Since 3 < 6, the session is automatically flagged, and an alert is created: "Low satisfaction score (3/10) detected. Key issues: generic advice, salary question dismissed, felt rushed."

**Impact cascade:**
- The HR consultant's dashboard immediately reflects the new score — their rolling average drops, and the flagged session appears with improvement suggestions: "Consider providing personalised, research-backed advice. Address all candidate questions, especially on salary topics."
- The Super Admin dashboard receives the alert, showing the consultant's name, the score, and the key issues. The admin can review the situation, potentially scheduling a quality improvement conversation with the consultant.
- Priya sees a "Thank you for your feedback" confirmation, knowing her voice was heard. The privacy notice assures her that her identity was not shared with any AI system.

From a **Sustainability** pillar perspective, this systematic quality improvement loop helps underserved job seekers like Priya get progressively better guidance. Each piece of feedback makes the platform smarter and more responsive, creating a sustainable cycle where candidate voices directly improve the service that serves them.

---

## Section 4: Dashboard Integration

### A. User (Candidate) Dashboard

The Candidate Experience Agent integrates with the User Dashboard through three key touchpoints:

**Post-consultation survey popup.** When a candidate's consultation session is marked as completed, a survey component appears on their dashboard. The survey is intentionally brief — a 5-star interactive rating (click to select) and an optional free-text comment box — designed to take less than 60 seconds to complete. This brevity respects the candidate's time while gathering meaningful feedback. A clear privacy notice is displayed: "Your feedback is anonymised before AI analysis. Your identity is never shared with AI systems."

**Personal satisfaction history.** Candidates can view their own feedback trail — a chronological list showing their last 5 sessions (or more), the date, the consultant's name, the star rating they gave, and the AI-generated summary of their feedback. This transparency builds trust: candidates can see that their feedback was processed and understood.

**Session management.** The dashboard displays upcoming and past sessions with their statuses. For completed sessions without a survey, a prominent "Give Feedback" button is shown, nudging candidates to complete the feedback loop.

---

### B. HR Consultant Dashboard

The HR Consultant dashboard transforms raw feedback data into a professional development tool, consciously framed as supportive rather than punitive:

**Real-time satisfaction score widget.** A large, centralised widget displays the consultant's rolling average satisfaction score, colour-coded for instant comprehension: green (≥ 7, performing well), yellow (5–6, needs attention), red (< 5, requires immediate improvement). This score updates in real time as new surveys are submitted.

**Flagged sessions with AI improvement suggestions.** Sessions that received scores below 6/10 are listed with their AI-analysed key issues and generated improvement tips. For example: "Multiple candidates mentioned feeling rushed — consider extending session time or prioritising candidate questions at the start."

**Weekly performance trend graph.** A line chart shows the consultant's satisfaction score trajectory over recent sessions, making it easy to spot improvement or decline patterns.

From the **Workers** pillar, the dashboard language is carefully chosen: "Here's how you can grow" rather than "Here's what you did wrong." Feedback is positioned as a gift from candidates, and improvement suggestions are framed as professional development opportunities, not disciplinary notices.

---

### C. Super Admin Dashboard

The Super Admin dashboard provides comprehensive platform oversight:

**Platform-wide satisfaction trend graph.** A monthly/weekly area chart shows the overall platform satisfaction trajectory, enabling admins to identify systemic quality trends — both improvements from training initiatives and declines that need intervention.

**Unresolved alerts list.** Every low-score session that has been flagged by the CEA appears here with full details: consultant name, session date, satisfaction score, AI-extracted key issues, and a "Mark Resolved" button. This ensures no quality issue falls through the cracks.

**Consultant leaderboard.** A sortable table ranks all consultants by their average satisfaction score, total sessions conducted, and number of flagged sessions. This enables quick identification of top performers for recognition and struggling consultants for support.

From the **Governance** pillar, the Super Admin dashboard includes a full audit trail of every agent decision. Every alert, every score calculation, and every AI analysis can be traced back to its source data, creating an accountable, transparent quality management system.

---

### D. Licensing Dashboard

The Licensing Dashboard provides compliance-relevant aggregate metrics while strictly protecting individual privacy:

**Aggregate quality metrics.** The dashboard displays platform-level statistics only: average satisfaction score per quarter, total consultations conducted, total feedback responses received, and response rate (surveys completed / sessions completed × 100%). No individual candidate data is ever displayed.

**Compliance-ready reports.** A summary statement shows whether the platform meets quality thresholds: "Platform average satisfaction score of X.X/10 meets the quality threshold of 6.0/10 required for licensing compliance." An export button generates a structured JSON report for submission to licensing authorities.

**Quarterly trend visualisation.** A bar chart shows monthly satisfaction scores within a selected quarter, providing regulators with clear evidence of consistent quality maintenance or improvement trajectories.

---

## Section 5: Technical Architecture

### Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Next.js 14 + React + Tailwind CSS | Server-rendered UI with App Router |
| Backend | Next.js API Routes (serverless) | Stateless API endpoints, Vercel-compatible |
| AI Engine | Groq API — LLaMA 3.1 8B Instant | Sentiment analysis + key issue extraction |
| Database | Supabase (PostgreSQL + Auth + Realtime) | Structured data, authentication, live subscriptions |
| File Storage | AWS S3 | Future consultation recordings |
| Hosting | Vercel | Serverless deployment with edge functions |

### End-to-End Flow

1. **Session completion trigger.** When an HR consultant marks a session as 'completed' in Supabase, a database event is detected (via Supabase Realtime subscription or polling).

2. **Survey notification.** The candidate's dashboard detects the completed session and displays the survey component, prompting the candidate to rate their experience.

3. **Survey submission.** The candidate selects a star rating (1–5), optionally writes a text comment, and clicks "Submit Feedback." The frontend POSTs to `/api/surveys/create`.

4. **Data persistence.** The API route validates the input, creates a survey record in Supabase's `surveys` table, and triggers the analysis step.

5. **PII stripping.** Before sending the comment text to any AI service, the API route strips personally identifiable information — names, email addresses, phone numbers — replacing them with generic placeholders like [CANDIDATE] and [CONSULTANT].

6. **Groq AI analysis.** The anonymised comment is sent to the Groq API using the LLaMA 3.1 8B Instant model with a structured system prompt requesting JSON output: sentiment classification, key issues array, sentiment score, and summary.

7. **Score calculation.** The satisfaction score is computed using a blended formula: `Math.round(((star_rating / 5) + ((sentiment_score + 1) / 2)) / 2 * 10)`. This produces a 1–10 score that weights both explicit rating and implicit sentiment equally.

8. **Data update.** The survey record in Supabase is updated with the AI analysis results (sentiment, key issues, summary) and the calculated satisfaction score.

9. **Alert generation.** If the satisfaction score is below 6, an alert is automatically created in the `alerts` table, linked to the survey and consultant, with a descriptive message including the score and key issues.

10. **Real-time dashboard updates.** Supabase Realtime subscriptions push the new data to all connected dashboards simultaneously. The consultant sees their updated score, the admin sees any new alerts, and the candidate sees confirmation of their submission.

From the **Environment** pillar, this serverless architecture means compute resources only activate when needed — when a survey is submitted, when an analysis is requested, when a dashboard is loaded. There are no always-on servers idling and consuming energy. The Vercel + Supabase stack is inherently efficient, scaling to zero when inactive and scaling up elastically during peak usage. This aligns with sustainable technology practices by minimising the platform's carbon footprint per interaction.

---

## Section 6: Integration With Phase 1

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/surveys/create` | POST | Creates a new survey after session ends |
| `/api/surveys/analyse` | POST | Calls Groq API and stores AI analysis |
| `/api/surveys/consultant/[id]` | GET | Returns consultant's satisfaction data and trends |
| `/api/alerts` | GET | Returns unresolved alerts for Super Admin |
| `/api/alerts` | PATCH | Marks an alert as resolved |

### Event Triggers

The primary trigger is the session status change. When a session record in Supabase is updated with `status = 'completed'`, the candidate dashboard detects this via Supabase Realtime subscription and presents the survey flow. This event-driven architecture ensures zero manual intervention is needed to initiate the feedback collection process.

### Data Flow

```
Candidate submits survey in React UI
    → Next.js API route (/api/surveys/create)
    → PII stripped from comment text
    → Groq API (LLaMA 3.1 8B analysis)
    → Results stored in Supabase (surveys table)
    → Score < 6? → Alert created (alerts table)
    → Supabase Realtime broadcasts changes
    → All 4 dashboards update simultaneously
```

### Security (MCP/APA Compliance)

**Authentication:** All API routes are protected with JWT tokens issued by Supabase Auth. Unauthenticated requests receive a 401 response. Tokens are validated server-side on every request.

**Row Level Security (RLS):** Every Supabase table has RLS policies:
- Candidates can only read their own survey responses
- HR Consultants can only read surveys linked to their sessions
- Super Admin and Licensing roles can read all records
- Write operations are restricted to the appropriate role contexts

**Data Anonymisation:** Before any candidate feedback text is sent to the Groq API, a PII-stripping function removes names, email addresses, phone numbers, and other identifying information, replacing them with generic tokens. This ensures that the external AI service never receives personally identifiable data.

**Transport Security:** All communications use HTTPS. API keys and secrets are stored as environment variables, never hard-coded or exposed to the frontend. The Supabase anon key (public) is used for client-side operations; the service role key (private) is used only in server-side API routes.

From the **Customers** pillar, candidate data is never exposed raw to AI systems. The anonymisation layer is not optional — it's structurally enforced in the API pipeline. Candidates can trust that their career concerns, salary questions, and personal feedback are analysed for quality improvement purposes without their identity ever being attached to the data that leaves the platform's boundaries.

---

## Section 7: Build Timeline

| Week | Activities |
|------|-----------|
| **Week 1** | Architecture design, API contract definition, Supabase schema setup, RLS policy implementation, development environment configuration |
| **Week 2–3** | Core agent development: survey creation system, Groq API integration, sentiment analysis pipeline, satisfaction score calculation engine, alert generation system, PII stripping module |
| **Week 4** | Dashboard widget development for all 4 roles, Recharts integration for trend visualisations, real-time Supabase subscription implementation, responsive layout work |
| **Week 5** | Comprehensive testing: unit tests for score calculation and PII stripping, integration tests for the full survey→AI→alert pipeline, security audit of RLS policies and JWT validation, cross-browser and responsive testing |
| **Week 6** | Vercel deployment, production environment variable configuration, monitoring and alerting setup, comprehensive documentation, demo data seeding, final QA pass |

---

---

# PART B — CANDIDATE EXPERIENCE AGENT: DESIGN DOCUMENT

---

## 1. Problem Statement

The JSO platform currently operates without any mechanism to evaluate the quality of consultation sessions between candidates and HR consultants. When a session ends — whether it was transformative or deeply inadequate — no data is captured, no analysis is performed, and no action is taken. This creates a dangerous quality blind spot where the platform has zero visibility into its core value proposition: the consultation experience.

The consequences of this blind spot are severe and compounding. Poorly performing consultants continue delivering substandard sessions because there is no detection system. Candidates who have negative experiences silently disengage from the platform, creating invisible churn that erodes the user base without generating any diagnostic data. Platform administrators make decisions about consultant assignments, training investments, and service improvements based on intuition rather than evidence, leading to misallocated resources and missed improvement opportunities.

This problem is not merely operational — it is existential for a platform whose value depends on consultation quality. Without systematic quality measurement, JSO cannot credibly promise candidates that their sessions will be valuable, cannot hold consultants accountable to quality standards, and cannot demonstrate to licensing authorities that the platform meets minimum service quality thresholds. The Candidate Experience Agent directly addresses this by creating an automated, AI-powered feedback loop that captures every consultation experience, analyses it intelligently, and drives measurable quality improvement across the platform.

---

## 2. Agent Overview

| Attribute | Detail |
|-----------|--------|
| **Name** | Candidate Experience Agent (CEA) |
| **Type** | Reactive + Goal-Oriented AI Agent |
| **Purpose** | Automate satisfaction measurement, AI-analyse feedback, flag quality issues, and drive consultant improvement |
| **Scope** | Post-consultation feedback collection, AI sentiment analysis, satisfaction scoring, alert generation, trend reporting |
| **AI Model** | Groq LLaMA 3.1 8B Instant (free tier) |
| **Primary Metric** | Platform-wide average satisfaction score (target: ≥ 7/10) |
| **Data Store** | Supabase PostgreSQL (surveys, alerts tables) |

---

## 3. How It Works — Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Session marked 'completed' in Supabase                  │
│  2. Candidate dashboard detects completed session            │
│  3. Survey popup displayed (star rating + comment)           │
│  4. Candidate submits feedback                               │
│  5. API route receives submission                            │
│  6. PII stripped from comment text                           │
│  7. Anonymised text sent to Groq LLaMA 3.1 8B               │
│  8. AI returns: sentiment, key_issues, score, summary        │
│  9. Satisfaction score calculated (blended formula)          │
│ 10. Survey record updated in Supabase                        │
│ 11. Score < 6? → Alert created automatically                 │
│ 12. Supabase Realtime pushes updates to all dashboards       │
└─────────────────────────────────────────────────────────────┘
```

**Detailed Flow:**

**Step 1–3: Trigger & Collection.** The moment a session record's status changes to 'completed,' the candidate's dashboard detects this and presents a clean, focused survey — a 5-star interactive rating and an optional text comment box. A privacy notice is always visible.

**Step 4–6: Submission & Anonymisation.** When the candidate clicks "Submit Feedback," the data is sent to the `/api/surveys/create` endpoint. The comment text passes through a PII-stripping function that removes names, emails, phone numbers, and other identifiers using pattern matching. This anonymised version is what the AI sees.

**Step 7–8: AI Analysis.** The anonymised comment is sent to Groq's API with the LLaMA 3.1 8B Instant model. The system prompt instructs the model to return a strictly-formatted JSON object containing sentiment classification, key issues array, a numerical sentiment score (−1.0 to 1.0), and a one-sentence summary.

**Step 9–10: Scoring & Storage.** The satisfaction score is calculated using: `Math.round(((star_rating / 5) + ((sentiment_score + 1) / 2)) / 2 * 10)`. This blended formula ensures both the explicit rating and implicit sentiment contribute equally. All results are stored in the surveys table.

**Step 11–12: Alerting & Real-time Updates.** If the score falls below 6, an alert is created with a descriptive message. Supabase Realtime subscriptions push the updated data to all connected dashboard clients instantly.

---

## 4. Dashboard Integration

### Candidate Dashboard
- **Survey popup:** Appears after session completion, with star rating + comment + privacy notice
- **Satisfaction history:** Chronological list of past feedback with AI summaries
- **Session list:** All sessions with status indicators and "Give Feedback" actions

### HR Consultant Dashboard
- **Score widget:** Large, colour-coded rolling average satisfaction score
- **Trend chart:** Line chart showing score trajectory over recent sessions
- **Recent feedback:** Latest surveys with sentiment badges, AI summaries, key issue tags
- **Flagged sessions:** Highlighted in red with AI-generated improvement tips

### Super Admin Dashboard
- **Platform metrics:** Global satisfaction score, session count, active alerts, survey count
- **Trend chart:** Platform-wide satisfaction over time (area chart)
- **Consultant leaderboard:** Ranked by satisfaction score, sortable
- **Alerts panel:** Active alerts with detail and resolution actions

### Licensing Dashboard
- **Aggregate metrics only:** Platform average, total consultations, response rate
- **Compliance statement:** Whether platform meets quality thresholds
- **Quarterly trends:** Bar chart of monthly scores per quarter
- **Export capability:** Structured data export for regulatory submissions

---

## 5. Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│   Next.js 14 (App Router) + React + Tailwind CSS    │
│   ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ │
│   │Candidate │ │Consultant│ │ Admin  │ │Licensing│ │
│   │Dashboard │ │Dashboard │ │Dashboard│ │Dashboard│ │
│   └────┬─────┘ └────┬─────┘ └───┬────┘ └────┬────┘ │
└────────┼────────────┼───────────┼───────────┼──────┘
         │            │           │           │
    ┌────▼────────────▼───────────▼───────────▼──────┐
    │              NEXT.JS API ROUTES                 │
    │  /api/surveys/create    /api/surveys/analyse    │
    │  /api/surveys/consultant/[id]   /api/alerts     │
    └──────────┬──────────────────┬───────────────────┘
               │                  │
    ┌──────────▼──────┐  ┌───────▼────────┐
    │   SUPABASE      │  │   GROQ API     │
    │  PostgreSQL     │  │  LLaMA 3.1 8B  │
    │  Auth + RLS     │  │  (Sentiment)   │
    │  Realtime       │  └────────────────┘
    └─────────────────┘
```

---

## 6. AI Analysis Logic

### Prompt Structure

```
System: You are a sentiment analysis engine for a career consultation platform.
Analyse the candidate feedback and return ONLY a JSON object with these fields:
{
  "sentiment": "positive" | "neutral" | "negative",
  "key_issues": ["issue1", "issue2"],
  "sentiment_score": <number between -1.0 and 1.0>,
  "summary": "<one sentence summary>"
}
Do not return anything other than the JSON object.

User: [anonymised candidate feedback text]
```

### Output Format

| Field | Type | Description |
|-------|------|-------------|
| `sentiment` | string | Overall sentiment: "positive", "neutral", or "negative" |
| `key_issues` | string[] | Array of specific issues mentioned (e.g., "felt rushed", "generic advice") |
| `sentiment_score` | number | Numerical score from −1.0 (very negative) to 1.0 (very positive) |
| `summary` | string | One-sentence summary of the feedback |

### PII Stripping (Pre-Processing)

Before sending to Groq, the comment text is processed:
- Names matching candidate/consultant profiles are replaced with [CANDIDATE]/[CONSULTANT]
- Email addresses are replaced with [EMAIL]
- Phone numbers are replaced with [PHONE]
- Other patterns (addresses, IDs) are sanitised

---

## 7. Scoring System

### Formula

```
satisfaction_score = Math.round(
  ((star_rating / 5) + ((sentiment_score + 1) / 2)) / 2 * 10
)
```

### Components

| Component | Range | Weight | Rationale |
|-----------|-------|--------|-----------|
| Star Rating | 1–5 (normalised to 0–1) | 50% | Candidate's explicit satisfaction rating |
| AI Sentiment | −1.0 to 1.0 (normalised to 0–1) | 50% | Implicit sentiment from comment text |

### Score Interpretation

| Score Range | Classification | Dashboard Colour | Action |
|-------------|---------------|-----------------|--------|
| 8–10 | Excellent | Green | No action needed |
| 7 | Good | Green | No action needed |
| 5–6 | Needs Attention | Yellow | Monitor trend |
| 1–4 | Poor | Red | Alert generated, intervention required |

### Examples

| Star Rating | Sentiment Score | Satisfaction Score | Flagged? |
|-------------|----------------|-------------------|----------|
| 5/5 | 0.9 | 10/10 | No |
| 4/5 | 0.3 | 7/10 | No |
| 3/5 | 0.0 | 6/10 | No |
| 2/5 | −0.5 | 3/10 | Yes |
| 1/5 | −0.8 | 2/10 | Yes |

---

## 8. Alert System

### Trigger Conditions

An alert is created automatically when:
- A survey's calculated satisfaction score is **below 6/10**
- The `flagged` field on the survey is set to `true`

### Alert Content

```json
{
  "survey_id": "<uuid>",
  "consultant_id": "<uuid>",
  "message": "Low satisfaction score (3/10) detected for consultant. Key issues: felt rushed, generic advice, salary question dismissed",
  "resolved": false,
  "created_at": "<timestamp>"
}
```

### Alert Lifecycle

1. **Created** — Automatically when score < 6
2. **Visible** — Appears on Super Admin dashboard immediately via Supabase Realtime
3. **Reviewed** — Admin reads alert details, key issues, and AI summary
4. **Resolved** — Admin clicks "Mark Resolved" after taking action (e.g., consultant coaching)
5. **Archived** — Resolved alerts move to the "Resolved" tab for historical record

### Visibility

| Role | Can See Alerts? | Can Resolve? |
|------|----------------|-------------|
| Candidate | No | No |
| HR Consultant | Own flagged sessions only | No |
| Super Admin | All alerts | Yes |
| Licensing | Aggregate alert counts only | No |

---

## 9. Privacy & Ethics

### Data Protection Measures

1. **PII Stripping:** All personally identifiable information is removed from feedback text before it is sent to any external AI service (Groq). Names, emails, phone numbers, and other identifiers are replaced with generic tokens.

2. **Row Level Security:** Supabase RLS policies ensure candidates can only access their own data, consultants can only see feedback linked to their sessions, and administrative views are role-gated.

3. **JWT Authentication:** Every API request is authenticated via Supabase-issued JWT tokens. Unauthenticated requests are rejected at the middleware level.

4. **Anonymised Consultant Views:** On the consultant dashboard, candidate names are anonymised ("Candidate A," "Candidate B") to protect candidate identity while still providing meaningful feedback data.

5. **No Raw Data in Licensing:** The licensing dashboard shows only aggregate metrics — no individual candidate responses, comments, or identifiable information.

6. **HTTPS Only:** All data transmission uses encrypted HTTPS connections. API keys are stored as server-side environment variables, never exposed to the client.

7. **Consent-Based Feedback:** Candidates are informed that their feedback will be AI-analysed before submission, with a clear privacy notice on every survey form.

### Ethical Framework

- **Transparency:** Candidates know their feedback is processed by AI. The privacy notice is always visible.
- **Fairness:** The scoring system uses both explicit ratings and AI sentiment, preventing single-metric bias.
- **Accountability:** Every agent action is logged and auditable by Super Admins.
- **Growth-Oriented:** Consultant feedback is framed for professional development, not punishment.

---

## 10. Part C Pillars Integration Table

| Pillar | How CEA Addresses It |
|--------|---------------------|
| **Governance** | All agent decisions are logged and auditable. Full transparency in scoring, alerting, and AI analysis. Super Admin dashboard provides complete audit trail. RLS policies enforce data access controls. |
| **Workers** | Consultant feedback is framed as a professional growth tool, not surveillance. Improvement suggestions are constructive and specific. Performance trends help consultants track their own development trajectory. |
| **Community** | Survey design supports multilingual candidates (future enhancement). The feedback system gives every candidate — regardless of background — an equal voice in platform quality. Anonymisation ensures feedback is judged on content, not identity. |
| **Environment** | Serverless architecture (Vercel + Supabase) means compute resources only activate on demand. No idle servers consuming energy. The Groq API uses efficient inference (LPU), minimising the carbon footprint per AI analysis call. |
| **Customers** | Candidate data is never exposed raw to AI. PII stripping is structurally enforced, not optional. Candidates receive clear privacy notices. Feedback directly drives service improvements that benefit candidates. Personal satisfaction history provides transparency. |
| **Sustainability** | Systematic quality improvement creates a virtuous cycle: better feedback → better consultants → better candidate outcomes → higher platform value. This sustainable loop ensures long-term platform viability and continuously improves service for underserved job seekers globally. |

---

*End of Assignment Answers*
