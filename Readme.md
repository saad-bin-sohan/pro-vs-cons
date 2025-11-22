# Pro vs Cons

Pro vs Cons is a lightweight web app for creating, sharing, and collaboratively evaluating pros-and-cons style decision lists. It includes a React + Vite frontend and an Express + MongoDB backend with JWT authentication, shareable public lists, voting, comments, reminders, and timeline events.

**Tech Stack**
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtokens)

**Repository Structure**
- `client/` — React frontend (Vite)
- `server/` — Express backend, API routes, and DB connection

**Quick Links**
- `client/src/services/api.js` — Axios instance using `import.meta.env.VITE_API_BASE_URL`
- `server/config/db.js` — MongoDB connection (uses `MONGO_URI`)
- `server/utils/generateToken.js` — JWT token generation (uses `JWT_SECRET`)

**Requirements**
- Node.js v18+ (recommended)
- npm v9+ or yarn
- MongoDB instance (Atlas or local)

**Environment Variables**
Create a `.env` file in the `server/` folder with at least the following keys:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-jwt-secret>
# Optional
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
CLIENT_DOMAIN_SUFFIXES=vercel.app
PORT=5001
NODE_ENV=development
```

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
- Keep changes small and focused. Add tests and update this README when adding or changing APIs.

**Deployment Notes**
- Ensure `JWT_SECRET` and `MONGO_URI` are set on your host.
- For CORS, `server/index.js` reads `CLIENT_URL`, `CLIENT_URLS`, and `CLIENT_DOMAIN_SUFFIXES` for allowed origins — set them to your deployed frontend origin(s).

**License**
- The `server/package.json` currently lists the license as `UNLICENSED`. Add or change a repository-level license file (`LICENSE`) if you want to publish this project.

**Author / Contact**
- Repository owner: `saad-bin-sohan` (project files credit `Sohan` in server package.json)

If you'd like, I can also:
- add a minimal `LICENSE` file (MIT) and a `.gitignore` for Node/Vite
- add a short `CONTRIBUTING.md` or expand API examples

---
Happy hacking! If you want, I can commit this change and run a quick smoke test locally (if you want me to run commands here first, tell me which approach you prefer).
