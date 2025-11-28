# Pro vs Cons

Pro vs Cons is a lightweight, modern web app for creating, sharing, and collaboratively evaluating pros-and-cons style decision lists.

It’s designed to be:
- **Fast & focused** for real-world decisions.
- **Collaborative** with sharing, comments, and anonymous voting.
- **Insightful** with scoring, category impact, and outcome reflection.
- **Polished** with a clean light theme, subtle animations, and responsive layout.

It includes a React + Vite frontend and an Express + MongoDB backend with JWT authentication.

---

## Features

### 🧾 Decision Lists

- **Multiple decision lists per user**  
  Create and manage separate lists for each decision (e.g., “New Job Offer”, “Moving Cities”, “Start a Business”).

- **Pros & Cons items with weights**  
  Each item supports:
  - Type: **Pro** or **Con**
  - Title & description
  - **Weight/importance** (e.g., 1–5 or similar scale)
  - Optional category/tag (Finance, Career, Health, etc.)

- **Automatic scoring & decision tilt**  
  The app calculates:
  - Total weighted score for **Pros**
  - Total weighted score for **Cons**
  - Overall **decision tilt** (which way the decision leans)

- **Draft vs Finalized mode**  
  - Start in **Draft** mode to freely add/edit items.
  - Switch to **Finalized** when you make a decision to lock the list state.
  - Helps you preserve what you were thinking at the time of the decision.

- **Per-list outcome & notes**  
  - Store the final outcome (Yes / No / Undecided).
  - Add **rationale notes** explaining *why* you chose that outcome.
  - Keep a **notes section** on each list for context that doesn’t fit neatly as a pro or con.

---

### 🧠 Decision Support

- **Templates for common decisions**  
  Start faster with prebuilt templates for common scenarios (e.g. job changes, moves, etc.), prefilled with typical pros and cons that you can customize.

- **Guided questions / prompts**  
  Get prompt suggestions to think more deeply about:
  - Finances
  - Long-term impact
  - Lifestyle
  - Relationships
  These appear alongside your list to nudge better thinking.

- **Perspective flip / “Devil’s advocate” mode**  
  Challenge your assumptions by:
  - Flipping perspective on items (e.g. “What could turn this Pro into a Con?”).
  - Encouraging you to think of hidden downsides/upsides.

- **Timeline / revisit reminders**  
  - Set reminders to **revisit a decision** later.
  - Supports timeline-style events so you can see when you decided and when you revisited.

- **Outcome reflection tracking**  
  After some time has passed, log whether:
  - The decision turned out **Good / Bad / Mixed**
  - Additional reflection notes  
  This builds a history of your decision quality over time.

---

### 📊 Analytics & Insights

- **Category impact analysis**  
  See which categories tend to drive your decisions. For example:
  - Do you mostly say “No” because of financial cons?
  - Are career-related pros usually decisive?

- **Decision history & patterns**  
  - View a history of your lists, final outcomes, and reflections.
  - Identify patterns in your decision-making behavior.

---

### 🤝 Collaboration & Sharing

- **Shareable read-only public links**  
  - Generate a **read-only share link** for a specific list.
  - Friends or colleagues can view your pros and cons without editing.

- **Comments & feedback**  
  - Comment on a list (either via share link or as an authenticated user).
  - Use it to gather feedback or external perspectives on your decision.

- **Anonymous voting on items**  
  - Viewers can **upvote/downvote specific pros/cons**.
  - Helps you see which points others find most convincing.

- **Archiving & duplication**  
  - Duplicate lists for similar decisions.
  - Archive lists without permanently deleting them.

---

### 🔐 Authentication & Security

- **JWT-based authentication**  
  - Register & login using email + password.
  - Protected routes for user-owned data.
  - Token-based authentication for API requests.

- **Protected vs public access**  
  - Your lists are private by default.
  - Public access is limited to shared tokens/links with controlled capabilities (view only, comment, vote, etc.).

---

### 🎨 UI / UX

- **Lightweight, modern UI**  
  - Clean light theme suitable for reading and focus.
  - Smooth, subtle animations for interactions (e.g. opening lists, adding items).

- **Responsive design**  
  - Works well on desktops, tablets, and mobile screens.

- **Distraction-free editor**  
  - Two-column layout for **Pros** and **Cons**.
  - Focused editing experience with minimal visual noise.

- **Search & filter across lists**  
  - Search by list title and content.
  - Filter by archive status, categories, and more.

- **Export & print**  
  - Export decision lists to **PDF** or image-friendly formats.
  - Print-ready layout for sharing in meetings or on paper.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtokens)

---

## Repository Structure

- `client/` — React frontend (Vite)
- `server/` — Express backend, API routes, and DB connection

**Quick Links**

- `client/src/services/api.js` — Axios instance using `import.meta.env.VITE_API_BASE_URL`
- `server/config/db.js` — MongoDB connection (uses `MONGO_URI`)
- `server/utils/generateToken.js` — JWT token generation (uses `JWT_SECRET`)

---

## Requirements

- Node.js v18+ (recommended)
- npm v9+ or yarn
- MongoDB instance (Atlas or local)

---

## Environment Variables

Create a `.env` file in the `server/` folder with at least the following keys:

```bash
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-jwt-secret>
# Optional
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
CLIENT_DOMAIN_SUFFIXES=vercel.app
PORT=5001
NODE_ENV=development


For the client, create a `.env` file in `client/` (or use your shell env) with:

```
VITE_API_BASE_URL=http://localhost:5001
```

Replace the host/port if your backend runs elsewhere.

**Install**
Install dependencies for both server and client.

```bash
# From repo root
cd server
npm install

cd ../client
npm install
```

**Development (run both)**
You have two options: run the server and client separately, or use the server's `dev` script which launches both concurrently.

Option A — from server (runs both frontend and backend):

```bash
cd server
npm run dev
```

Option B — run separately (useful for debugging):

```bash
# Start server
cd server
npm run server   # runs nodemon index.js (hot reload)

# In another terminal, start client
cd client
npm run dev      # vite dev server (default: http://localhost:5173)
```

**Production**
- Build the frontend: `cd client && npm run build`
- Serve the static build from any static server or host the frontend on Vercel/Netlify and point `VITE_API_BASE_URL` to the deployed backend.
- The backend can be deployed to Render, Heroku, Railway, etc. Make sure to set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URLS` in the host environment.

**API Overview**
Base path: `${VITE_API_BASE_URL}/api` (client uses `VITE_API_BASE_URL`)

Auth routes (`/api/auth`)
- `POST /login` — Request body: `{ email, password }` — Returns JWT and user info
- `POST /register` — Request body: `{ name, email, password }` — Creates a user and returns token
- `GET /profile` — Protected — Get currently authenticated user's profile

List routes (`/api/lists`)
- `GET /` — Protected — Get all lists for the authenticated user (`?archived=true` to include archived)
- `GET /:id` — Protected — Get single list by ID
- `POST /` — Protected — Create new list. Body example: `{ title, description, items: [...] }`
- `PUT /:id` — Protected — Update list
- `DELETE /:id` — Protected — Delete list
- `POST /:id/share` — Protected — Make a list public / generate share token
- `GET /public/:token` — Public — Fetch shared list by token
- `POST /:id/comments` — Public (with `shareToken`) or Protected — Add comment
- `POST /:id/vote` — Public (with `shareToken`) or Protected — Add/remove vote
- `POST /:id/duplicate` — Protected — Duplicate list
- `PUT /:id/archive` — Protected — Toggle archive

Authentication: send `Authorization: Bearer <token>` header for protected routes. The client automatically attaches the token from `localStorage` (see `client/src/services/api.js`).

Example: Register & Login (curl)

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"password123"}'
```

**Database**
- The server uses Mongoose. Provide a valid `MONGO_URI` (Atlas recommended for production). The app will create required collections automatically.

**Testing**
- There are no automated tests included. For manual testing, use the client UI or API tools such as Postman / curl.

**Contributing**
- Feel free to open issues and PRs.
- Keep changes small and focused.
- Update this README when adding or changing APIs or user-facing features.

**License**
- MIT

**Author / Contact**
- Repository owner: `saad-bin-sohan` (project files credit `Sohan` in server package.json)
