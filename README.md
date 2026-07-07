# PersonaFlow — Ecommerce Personalization Rules Engine

A full‑stack SaaS dashboard for classifying ecommerce shoppers into five behavioral states (Browser, Comparer, Discount Seeker, Cart Abandoner, Loyal Customer).  
It combines a **real‑time rule engine**, **Supabase persistence**, **authentication**, **AI‑powered explanations**, and a **command palette**.

## 🌟 Features

- **Live shopper classification** – event streams → deterministic rule engine → state + confidence + evidence.
- **Score transparency** – see the score of every state, not just the winner.
- **Simulator** – add/remove events to any session and watch the classification update instantly.
- **Animated customer journey** – replay a session’s events with a speed‑controlled scrubber.
- **AI‑powered stories** – one‑click generation of natural‑language explanations (OpenAI).
- **Command palette (⌘K)** – jump to any page or session instantly.
- **Rule editor** – tweak classifier weights live; the Dashboard, Sessions, and Insights pages react immediately.
- **Insights** – aggregate stats, distribution charts, and a conversion funnel.
- **Authentication** – sign up / sign in with Supabase Auth.
- **Multi‑tenant ready** – each user can have their own data (scoped by `user_id`).
- **Real database** – all sessions and events stored in Supabase (PostgreSQL).
- **Tests** – unit tests for the classifier and API routes.
- **Demo account** – one‑click login with `demo@personaflow.com` / `demopassword123`.

  
## 🛠️ Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19 + TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: OpenAI API (optional, for story generation)
- **State**: React Context (client‑side store)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+
- A Supabase account (free tier works)
- (Optional) An OpenAI API key for AI stories

### 1. Clone the repository

```bash
git clone https://github.com/anushkawakchoure/personaflow.git
cd personaflow

## Pages

- **Dashboard** (`/`) — session list + detail view: event timeline,
  classification panel, and the simulator (add/remove events, reset).
- **Sessions** (`/sessions`) — every session in a sortable, filterable
  table. Click a row to jump straight to it on the Dashboard.
- **Rules** (`/rules`) — live sliders for every weight behind the
  classifier. Moving a slider recalculates classification everywhere in the
  app instantly (Dashboard, Sessions, Insights), plus a live distribution
  chart and a worked example so you can see the effect immediately.
- **Insights** (`/insights`) — aggregate stats: shopper state distribution,
  a view → cart → checkout → purchase funnel, and an event-type breakdown,
  all computed live from current sessions and current rule weights.

All four pages share one client-side store (`lib/store.tsx`), so simulator
edits and rule-weight changes are visible everywhere without a page reload.

Database Schema
sessions

id (UUID) – primary key

visitor_id (text) – customer identifier

user_id (UUID) – references auth.users (multi‑tenant)

created_at (timestamptz)

updated_at (timestamptz)

is_returning_customer (boolean)

events

id (UUID) – primary key

session_id (UUID) – references sessions

type (text) – event type (e.g., view_product, purchase)

timestamp (timestamptz)

metadata (JSONB) – additional event data

classifications

id (UUID) – primary key

session_id (UUID) – references sessions

state (text) – classified shopper state

confidence (float) – confidence score (0–100)

evidence (JSONB) – supporting evidence

created_at (timestamptz)

## How it's organized

```
app/
  (public)/           # landing, login, signup (no sidebar)
  api/                # Supabase API routes (sessions, explain, seed)
  dashboard/          # main authenticated dashboard
  sessions/           # sortable/filterable table
  rules/              # weight sliders + live distribution
  insights/           # stats, funnel, event breakdown
  settings/           # user preferences (theme, auto‑save)
  layout.tsx          # root layout with sidebar + providers
  globals.css         # global styles + dark/light theme

components/
  Sidebar.tsx         # navigation with auth status
  Header.tsx          # top bar with search
  SessionCard.tsx     # session card with avatar + returning badge
  SessionList.tsx     # scrollable, filterable list
  EventTimeline.tsx   # animated customer journey
  ClassificationPanel.tsx  # verdict, confidence ring, evidence, score bars
  SimulatorPanel.tsx  # add/remove events, reset
  CommandPalette.tsx  # ⌘K global search
  ProtectedRoute.tsx  # authentication guard
  StateBadge.tsx      # colored shopper state badge
  ConfidenceRing.tsx  # circular confidence gauge
  LayoutContent.tsx   # conditionally hides sidebar on public routes

lib/
  store.tsx           # global state (sessions, weights, selection)
  auth.tsx            # Supabase authentication context
  classifier.ts       # rule engine
  supabase.ts         # Supabase client
  theme.tsx           # dark/light mode
  mock-data.ts        # 9 mock sessions for seeding
  utils.ts            # helpers (cn(), time formatting, labels)

types/
  session.ts          # TypeScript interfaces

__tests__/
  classifier.test.ts  # unit tests for classifier
  api.test.ts         # API route smoke tests
```

## How classification works right now

The classifier tallies event counts and applies weighted formulas (defined in lib/classifier.ts). Each of the five states gets a score, and the highest wins. Weights are stored in the client‑side store and can be tweaked live on the Rules page.

Scores are normalized to 0–100, and the panel shows a horizontal bar for each state – so you can see why a session wasn’t classified as something else.


The five states:

- **Browser** — passive viewing, no strong intent signals
- **Comparer** — repeated comparisons, searches, review reads
- **Discount Seeker** — coupon and wishlist activity
- **Cart Abandoner** — cart/checkout activity with no completed purchase
- **Loyal Customer** — a completed or repeat purchase on record

Try the simulator panel on any session — adding a `purchase` event to a
"Cart Abandoner" session, for instance, will immediately flip it to
"Loyal Customer" since the classifier re-runs on every render. Or open Rules
and drag the Cart Abandoner weights down — watch the Insights funnel and
distribution chart shift in response.



