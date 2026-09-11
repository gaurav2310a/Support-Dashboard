# SupportDesk – Customer Support Dashboard

A production-quality customer support dashboard built for a frontend technical
assessment. It uses React + Vite + Tailwind CSS + Zustand + React Router +
Lucide React, backed by a JSON Server mock REST API.

---

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Language       | JavaScript (React 18)              |
| Build / Server | Vite 5                             |
| Styling        | Tailwind CSS 3                     |
| State          | Zustand                            |
| Routing        | React Router v6                    |
| Icons          | Lucide React                       |
| Mock API       | JSON Server                        |

---

## Prerequisites

- **Node.js 18+** (Vite 5 requires Node 18+). Verify with `node -v`.
- **npm** (comes with Node).

---

## Setup & Running (two terminals required)

The app needs **both** the frontend and the mock API running at the same time.

```bash
# 1) Install dependencies (once)
npm install

# 2) Terminal 1 — start the mock REST API on http://localhost:3001
npm run api

# 3) Terminal 2 — start the frontend on http://localhost:5173
npm run dev
```

Then open **http://localhost:5173** in your browser.

> **Important:** if the API server is NOT running, the dashboard cannot load
> tickets and will show the **Error state with a Retry button** instead. Start
> `npm run api` and click **Retry**.

---

## API Endpoints

The mock API is `http://localhost:3001`:

| Method | Endpoint          | Description                            |
| ------ | ----------------- | -------------------------------------- |
| GET    | `/tickets`        | List all tickets                        |
| GET    | `/tickets/:id`    | Get a single ticket                     |
| PATCH  | `/tickets/:id`    | Update a ticket (status, conversation)  |

- `PATCH /tickets/:id` writes changes directly into `db.json`, so status
  changes and replies **persist across page reloads** and server restarts.

---

## Common Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start the Vite dev server (:5173)          |
| `npm run api`    | Start JSON Server mock API (:3001)         |
| `npm run build`  | Create an optimized production build       |
| `npm run preview`| Preview the production build              |

> **Tip:** on Windows, run `npm run dev` and `npm run api` in two separate
> PowerShell/terminal windows.

---

## Project Structure

```
src/
├── components/
│   ├── layout/     Header, Sidebar
│   ├── dashboard/  StatCard, TicketTable, TicketRow, TicketCard,
│   │               TicketFilters, StatusBadge, PriorityBadge,
│   │               TicketSkeleton, EmptyState, ErrorState
│   └── tickets/    TicketDetails (full-screen overlay), Conversation
├── pages/          Dashboard
├── store/          ticketStore.js (Zustand)
├── services/       ticketApi.js (only place that calls the API)
├── utils/          format.js (date/time formatting)
├── App.jsx
├── main.jsx
└── index.css
db.json             Mock data + live-persistence store for JSON Server
```

---

## Data Flow

```
           (1) fetch
  JSON Server ──────────────► ticketApi.js
                                      │
                              (2) hand data to store
                                      ▼
                              Zustand store (tickets, selectedTicket, filters)
                                      │
                         (3) derived selectors (pure functions)
                              │  selectFilteredTickets
                              │  selectStats
                              │  selectHasActiveFilters
                              ▼
                        Dashboard + components (UI)
                                      │
                          (4) user interaction
                    search / filter / open / change status / reply
                                      │
                          (5) Zustand action
                    ──► selectTicket / updateTicketStatus / addConversationMessage
                                      │
                          (6) PATCH  (open → GET /tickets/:id loads full detail)
                          (7) Zustand state updates (real-time)
                                      ▼
                              React re-render
```

- **Statistics are always derived** from the live `tickets` state via
  `selectStats` — they are never hardcoded. Changing a status updates the
  stat cards, the table/cards, and the open overlay automatically.
- **The homepage list is lean.** `GET /tickets` returns only the fields the
  dashboard renders (id, name, subject, priority, status, createdAt). When a
  ticket is opened, `GET /tickets/:id` lazily loads the full record
  (description, contact info, conversation) into `selectedTicket`.
- **The API layer is the only place that calls `fetch`** — no component talks
  to the network directly.

### Responsive behavior

- **≥1024px**: sidebar + table layout + full-screen overlay for ticket details
- **768px**: stats stay in a row, table adapts spacing
- **<768px**: tickets become cards, filters stack, overlay uses the full screen

---

## Features

- **Dashboard statistics** — Total, Open, In Progress, Resolved (derived).
- **Ticket list** — customer name, subject, priority, status, created date.
- **Search & filters** — search by customer name / subject, combined with
  Status and Priority filters (all conditions must match).
- **Change status** — dropdown in the row/card and in the overlay; validates
  the status, PATCHes the API, updates stats live, keeps the overlay in sync.
- **Ticket details** — full-screen overlay with customer info, issue
  description, date/time, and conversation history.
- **Continue conversation** — reply box in the overlay. **Enter** sends,
  **Shift+Enter** inserts a newline. Replies appear in real time and persist.
- **States** — polished loading (skeleton), error (with Retry), and empty
  (with Clear filters) states for the list; loading/error/empty handling in
  the conversation and reply flow too.
- **Responsive** — sidebar + table on desktop; ticket cards + stacked filters
  on mobile; full-screen overlay everywhere.
- **Accessible** — semantic HTML, visible focus states, `aria-label`s on
  icon-only buttons and dialogs.

---

## Troubleshooting

| Symptom                                    | Fix                                                              |
| ------------------------------------------ | ---------------------------------------------------------------- |
| Error state shown on load                  | `npm run api` isn't running — start the API, then click **Retry** |
| CORS error in the browser console          | JSON Server sends CORS headers by default; verify you're hitting `:3001` |
| Port 3001 / 5173 already in use            | Close the process, or change the port in `package.json` / `ticketApi.js` |
| Want to reset the mock data                | Restore `db.json` from git (`git checkout -- db.json`)            |

---

## AI Tools Used

This project was developed with heavy assistance from AI coding tools, per the
assessment's AI usage policy:

- **Anthropic Claude** (via a coding-agent IDE integration) — was used throughout
  for architecture design, component scaffolding, Zustand store design, state
  management, responsive UI implementation, and debugging (fixing the ticket
  detail overlay, lean homepage data, error/loading/empty states, etc.).

All code was reviewed, understood, and validated so it can be explained or
modified in a follow-up round.

---

## License

Built for a frontend technical assessment. All mock customer data is fictional.

