# Personalization Rules Engine — Frontend

A frontend-only SaaS dashboard for classifying ecommerce shoppers into five
behavioral states, using mock data and a client-side rule-based classifier.
No backend, no OpenAI, no Supabase — everything here runs in the browser
against static mock data, and every nav item is a real, working page.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build and run a production bundle instead:

```bash
npm run build
npm run start
```

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

## How it's organized

```
app/
  layout.tsx          Root layout — wraps everything in StoreProvider + Sidebar
  page.tsx             Dashboard page
  sessions/page.tsx    Sessions table page
  rules/page.tsx       Rules editor page
  insights/page.tsx    Insights/analytics page
  globals.css          Tailwind entrypoint + a few global resets
components/
  Sidebar.tsx          Left nav — real Next.js links, active route highlighted
  Header.tsx           Reusable top bar (title, optional search, optional actions)
  SessionCard.tsx      One card in the session list
  SessionList.tsx      Scrollable, searchable list of session cards
  EventTimeline.tsx    Vertical timeline of a session's raw events
  ClassificationPanel.tsx  Verdict, confidence ring, evidence, recommended action
  SimulatorPanel.tsx   Add/remove events, reset a session
  StateBadge.tsx        Reusable colored badge for a shopper state
  ConfidenceRing.tsx    Reusable circular confidence gauge
  EmptyState.tsx        Generic empty state
  LoadingState.tsx      Skeleton loading states for list + detail panel
lib/
  store.tsx             App-wide client store: sessions, selection, rule weights
  mock-data.ts         9 mock sessions covering all five shopper states
  classifier.ts         Rule-based classifier: events + weights in, ClassificationResult out
  utils.ts              cn() helper, state/event display metadata, time formatting
types/
  session.ts            Shared TypeScript interfaces, incl. RuleWeights
```

## How classification works right now

`lib/classifier.ts` tallies each session's events, scores all five shopper
states with independent weighted formulas, and returns whichever state
scores highest, normalized into a 0–100 confidence value. The weights are no
longer hardcoded constants — they live in `lib/store.tsx` as shared state,
default to `DEFAULT_RULE_WEIGHTS`, and can be tuned live from the Rules page.

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

## What to build next

1. **API layer** — a `/api/sessions` route (or a real backend) to replace
   `lib/mock-data.ts`, plus persistence for simulator edits and rule weights.
2. **Real event ingestion** — a tracking snippet or webhook that pushes live
   `SessionEvent`s in, instead of the hand-written mock array.
3. **LLM-assisted classification** — swap or augment `classifySession()`
   with an OpenAI call for nuanced cases the rule engine scores as a close
   tie between two states, using the same evidence/explanation shape so the
   UI doesn't need to change.
4. **Supabase** — store sessions, events, classification history, and rule
   weight versions so the dashboard reflects real customer data over time.
5. **Auth + multi-tenant** — scope sessions to a logged-in merchant account.
6. **Tests** — unit tests for `classifySession()` covering edge cases
   (empty sessions, ties, conflicting signals like cart abandonment + purchase).

