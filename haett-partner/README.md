# Haett Partner Programme

Full-stack affiliate partner portal. Single-page app with 6 views based on login state and application status.

## Stack
- **Backend**: Node.js, Express, SQLite (better-sqlite3), JWT auth
- **Frontend**: React 18, Vite, no UI library (pure CSS-in-JS)

## Setup (< 5 minutes)

### 1. Backend

```bash
cd backend
npm install
npm run setup       # runs migrations + seeds the database
npm run dev         # starts on http://localhost:4000
```

### 2. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

Open **http://localhost:5173/**.

---

## Test Credentials

| Role     | Email                 | Password     | State              |
|----------|-----------------------|--------------|--------------------|
| Admin    | admin@haett.com       | admin123     | Review panel       |
| New User | user@haett.com        | user123      | Application form   |
| Partner  | partner@haett.com     | partner123   | Approved dashboard |
| Pending  | pending@haett.com     | pending123   | Under review card  |
| Rejected | rejected@haett.com    | rejected123  | Rejection view     |

---

## API Endpoints

### Auth
| Method | Path               | Auth     | Description            |
|--------|--------------------|----------|------------------------|
| POST   | /api/auth/register | —        | Register a new user    |
| POST   | /api/auth/login    | —        | Login, returns JWT     |
| GET    | /api/auth/me       | Bearer   | Get current user       |

### Applications
| Method | Path                    | Auth     | Description                   |
|--------|-------------------------|----------|-------------------------------|
| GET    | /api/applications/my    | Bearer   | Current user's application    |
| POST   | /api/applications       | Bearer   | Submit a new application      |

### Admin
| Method | Path                               | Auth          | Description                  |
|--------|------------------------------------|---------------|------------------------------|
| GET    | /api/admin/applications?status=    | Bearer+Admin  | List all applications        |
| POST   | /api/admin/applications/:id/approve| Bearer+Admin  | Approve + create discount code|
| POST   | /api/admin/applications/:id/reject | Bearer+Admin  | Reject with reason           |
| PATCH  | /api/admin/codes/:id/toggle        | Bearer+Admin  | Activate/deactivate a code   |

---

## The Six Views

1. **Visitor** — Landing page with programme benefits and CTA
2. **Regular User** — Application form (partner type + business name required)
3. **Pending** — Status card with applied date
4. **Rejected** — Rejection reason + Reapply button
5. **Approved Partner** — Dashboard with stats and discount codes
6. **Admin** — Review panel with tabs, approve/reject with inline reason, code toggles

---

## What's Working

- ✅ All 6 views render correctly based on auth state
- ✅ JWT authentication (7-day expiry)
- ✅ Application submission with validation
- ✅ Admin approve flow (auto-creates discount code)
- ✅ Admin reject flow with inline reason input (confirm button disabled until reason typed)
- ✅ Rejected partner can reapply (form pre-filled)
- ✅ Admin can toggle code active/inactive
- ✅ Toast notifications on every action
- ✅ Loading + error states on all API calls
- ✅ No full page reloads between views
- ✅ Seed file with all five test accounts
