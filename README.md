# Issue Tracker System

## Project Overview

A simple web-based issue tracker. Users register, log in, create issues, assign them to other users, change their status and discuss them through comments. Admins get an extra dashboard, a user list and full control over all issues. It is one React application; the navigation and actions change automatically based on the logged-in user's role.

## Features

- Register / login / logout with JWT authentication (passwords hashed with bcrypt)
- Create, view, edit and delete issues (edit/delete: issue creator or admin)
- Assign issues to any registered user; view "My Assigned Issues"
- Status workflow: Open, In Progress, Closed
- Comments on each issue (author + timestamp)
- User dashboard: Total, Open, In Progress, Closed, Assigned to Me
- Admin dashboard: Total Users and issue counts; list of all users; manage (status, assign, delete) all issues directly from the issue list
- Role checks enforced in the backend as well as the UI

## Tech Stack

- **Frontend:** React (Vite, React Router)
- **Backend:** Node.js, Express, Mongoose, JWT
- **Database:** MongoDB (Atlas)
- **Hosting:** Vercel

## Project Structure

```
client/                 React app
  src/pages/            Login, Register, Dashboard, Issues, IssueForm, IssueDetails, Users, Profile
  src/components/       Layout (role-based navbar), StatusBadge
  src/api.js            fetch wrapper that adds the JWT
  src/AuthContext.jsx   login state and current user
server/                 Express API
  models/               User, Issue, Comment (Mongoose)
  routes/               auth, issues (incl. comments), misc (dashboard, users)
  middleware/auth.js    JWT check
  scripts/seed.js       creates the demo Admin and User accounts
```

## Setup

Requires Node.js 18+ and a MongoDB database (local or a free MongoDB Atlas cluster).

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd "issuse Tracker system"
   ```
2. Install dependencies
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Configure environment variables: copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`, then fill in the values.
4. Create the demo accounts (optional)
   ```bash
   cd server && npm run seed
   ```
5. Start the backend (http://localhost:5000)
   ```bash
   cd server && npm run dev
   ```
6. Start the frontend (http://localhost:5173)
   ```bash
   cd client && npm run dev
   ```

## Environment Variables

**server/.env**

```
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
```

**client/.env**

```
VITE_API_URL=http://localhost:5000/api
```

`CLIENT_URL` is the frontend origin allowed by CORS. `VITE_API_URL` must include the `/api` suffix.

## API

All endpoints except register/login need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register (always creates a USER) |
| POST | `/api/auth/login` | Login, returns token and user |
| GET | `/api/auth/me` | Current user |
| GET | `/api/issues` | List issues (`?status=Open`, `?assigned=me`) |
| POST | `/api/issues` | Create issue |
| GET | `/api/issues/:id` | Issue details |
| PUT | `/api/issues/:id` | Edit issue (creator or admin) |
| DELETE | `/api/issues/:id` | Delete issue and its comments (creator or admin) |
| PATCH | `/api/issues/:id/status` | Change status `{ status }` |
| PATCH | `/api/issues/:id/assign` | Assign `{ assignedTo: userId \| null }` |
| GET | `/api/issues/:id/comments` | List comments |
| POST | `/api/issues/:id/comments` | Add comment `{ text }` |
| GET | `/api/dashboard` | Counts (admins also get `totalUsers`) |
| GET | `/api/users` | Users. Admins get email/role/joined date; normal users get names only (for the assign dropdown) |

## Deployment

Hosted on **Vercel** as two projects from this one repository, with **MongoDB Atlas** as the database.

1. Create a free MongoDB Atlas cluster, a database user, and allow network access from `0.0.0.0/0` (Vercel uses dynamic IPs). Copy the connection string.
2. **Backend:** in Vercel, import the repo and set *Root Directory* to `server`. Add environment variables `MONGODB_URI`, `JWT_SECRET` (a long random string) and `CLIENT_URL` (the frontend URL, no trailing slash). Deploy.
3. **Frontend:** import the repo again with *Root Directory* `client` (Vite preset). Add `VITE_API_URL` = `<backend URL>/api`. Deploy.
4. Update `CLIENT_URL` on the backend to the final frontend URL and redeploy the backend.
5. Run `npm run seed` locally with `MONGODB_URI` pointing to the Atlas database to create the demo accounts.
6. To update: push to the Git branch connected to Vercel; both projects redeploy automatically.

## Live URL

- Frontend: https://issue-tracking-system-3o6k-2ev8doqa3-revathi11.vercel.app
- Backend API: https://issue-tracking-system-rlmgu9raz-revathi11.vercel.app

### Test accounts (created by `npm run seed`)

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@tracker.com | Admin@123 |
| User | user@tracker.com | User@123 |

These are demo-only accounts, not personal ones.
