# SyncZone 🌍

> **See your team. Sync your time. Schedule smarter.**

A full-stack remote team management dashboard that solves the real problem of distributed work: knowing when your teammates are available across the world. Built with React, Node.js, Express, and MongoDB — with JWT authentication, a live timezone engine, and an algorithm that finds your team's best meeting windows automatically.

🔗 [Live Demo](#) • 📁 [Repository](https://github.com/Adogacodes/synczone)

---

## 🚀 What It Does

SyncZone gives remote teams a single place to see who's online, what time it is for everyone, and when to schedule meetings — without the back-and-forth. Add team members with their timezone and working hours, and the app does the rest in real time.

---

## 🌟 Features

### 🖥️ Dashboard
- Live stat cards: total members, currently available, unique time zones covered, and best meeting window — all computed on the fly
- **Team Live View** — member cards with clocks that tick every second in each person's local time
- Working status badges (Working / Overlap Hours / Off Hours) that update automatically

### 📅 Timeline
- **24-hour UTC grid** showing every team member's working hours as colour-coded blocks (working / overlap / off)
- **Live time cursor** that moves in real time across the grid
- Hover any block to see the member's exact local time at that UTC hour
- **"Best meeting window" banner** — one click to pre-fill the meeting scheduler with the optimal slot

### 🤝 Meeting Scheduler
- Pick a date and time (UTC), instantly see it converted to every team member's local time and date
- Availability warnings for members outside working hours
- **AI-ranked suggestion slots** — top 3 UTC windows scored by maximum team overlap, with progress bars
- One-click **Copy All** — generates a ready-to-paste meeting invite string (e.g. `📅 Weekly Standup: 9:00 AM New_York | 2:30 PM Kolkata | ...`)

### 👥 Team Members
- Full CRUD: add, edit, and remove team members
- Each member stores name, role, timezone, working hours start/end, and avatar colour
- Sortable data table with live local time and status per row

### 🔐 Auth System
- JWT-based authentication with `httpOnly` cookie storage
- Protected routes — all app pages redirect to login if unauthenticated
- Register, login, and profile update flows
- **3 one-click demo accounts** on the login screen (no signup needed to explore the app)
- Demo vs. full account distinction tracked server-side

### ⚙️ Settings
- Edit name, email, timezone, and avatar colour with live preview
- Change password with confirmation validation
- Theme toggle (dark / light) persisted via context
- Account info panel with account type badge

---

## 🛠️ Tech Stack

### Frontend
| Tool | Usage |
|---|---|
| **React 18** | UI, routing, all client-side logic |
| **React Router v6** | Nested routes, protected routes, URL-synced navigation |
| **Framer Motion** | Page transitions, staggered card animations, micro-interactions |
| **Luxon** | All timezone-aware date/time computation |
| **Axios** | HTTP client with JWT interceptor |
| **CSS Variables + Custom CSS** | Fully themeable design system (dark/light) |

### Backend
| Tool | Usage |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Data persistence for users and team members |
| **JWT + bcrypt** | Stateless auth with hashed passwords |
| **cookie-parser** | `httpOnly` cookie handling for token storage |
| **express-async-errors** | Clean async error propagation |

---

## 🏗️ Architecture Highlights

- **`helpers.js` as a pure utility module** — all timezone logic (`getMemberStatus`, `computeOverlapSlots`, `convertToAllZones`, `isWorkingAt`) is framework-agnostic and fully testable in isolation
- **`computeOverlapSlots`** iterates all 24 UTC hours, scores each by how many members are working, and returns them sorted — a simple but effective algorithm that drives the meeting suggestion feature
- **Axios interceptor** — the `api.js` client automatically attaches the JWT from `localStorage` to every request header, so no component ever handles auth headers manually
- **URL-synced navigation** — `activePage` state stays in sync with React Router's URL via a `useEffect`, meaning deep links and browser back/forward work correctly
- **Live timeline cursor** — a `setInterval` recalculates the current UTC percentage every second and drives a CSS `left` position, giving a real-time feel with minimal overhead
- **Protected route pattern** — `ProtectedRoute` wraps all authenticated pages and reads from `AppContext`, keeping auth logic out of every individual page component
- **Demo account seeding** — the login page attempts a login first, and falls back to `register` if the demo account doesn't exist yet, making the demo always work on a fresh database

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# Clone the repo
git clone https://github.com/Adogacodes/synczone.git
cd synczone

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

Create a `.env` file in `/server`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
PORT=5000
```

### Running the App

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

Open `http://localhost:5173` — use a demo account on the login screen to explore instantly.

---

## 📁 Project Structure

```
synczone/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx      # Shell: sidebar + topbar + outlet
│   │   │   │   ├── Sidebar.jsx        # Nav, theme toggle, user footer
│   │   │   │   ├── Topbar.jsx         # Breadcrumb + quick actions
│   │   │   │   └── ProtectedRoute.jsx # Auth guard
│   │   │   ├── team/
│   │   │   │   ├── MemberCard.jsx     # Live clock card
│   │   │   │   └── MemberModal.jsx    # Add/edit member form
│   │   │   └── ui/
│   │   │       └── Toast.jsx          # Toast notification system
│   │   ├── context/
│   │   │   └── AppContext.jsx         # Global state (auth, members, theme)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── Meeting.jsx
│   │   │   ├── Team.jsx
│   │   │   └── Settings.jsx
│   │   ├── utils/
│   │   │   ├── helpers.js             # Pure timezone + status utilities
│   │   │   ├── api.js                 # Axios instance + JWT interceptor
│   │   │   ├── authApi.js             # Auth endpoint calls
│   │   │   └── memberApi.js           # Member CRUD calls
│   │   └── data/
│   │       └── mockData.js            # Default members + timezone list
│
└── server/
    ├── config/
    │   └── db.js                      # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   └── memberController.js
    ├── middleware/
    │   ├── authMiddleware.js           # JWT verify
    │   └── errorMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Member.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── memberRoutes.js
    └── server.js
```

---

## 💡 Key Design Decisions

**Why Luxon over date-fns or Day.js?**
Luxon has first-class timezone support via the IANA timezone database — critical for correctly computing "is it 9am in Kolkata right now?" across DST boundaries. The alternatives require plugins and workarounds for the same result.

**Why JWT in `httpOnly` cookies AND `localStorage`?**
The cookie provides XSS protection for the session; `localStorage` provides a quick token-present check for the Axios interceptor without a round trip. A trade-off made deliberately, not by accident.

**Why a pure `helpers.js` with no React imports?**
All timezone logic is stateless and deterministic — it takes data in and returns data out. Keeping it framework-free means it could be used in a Node.js script, tested with plain Jest, or migrated to a different frontend without changes.

---

## 🙌 Author

Built by **[Isaac Adoga (Vago Tech)]** — a full-stack developer who builds tools that solve real problems for real teams.

📬 [your@email.com](mailto:vagotech0@gmail.com) • 💼 [LinkedIn](#) • 🐙 [GitHub](https://github.com/Adogacodes)

---

## 📄 License

MIT — feel free to fork and build your own team tools.