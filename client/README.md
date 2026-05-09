# TaskFlow Frontend

A clean React frontend for the TaskFlow Task Management System.

## Tech Stack

- React 18 + React Router v6
- Tailwind CSS (custom config with DM Sans + Syne fonts)
- Axios (with auto token refresh interceptor)
- React Hot Toast
- Recharts (for statistics charts)
- Lucide React (icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file (already included):

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Change the URL if your backend runs on a different port.

### 3. Run the app

```bash
npm start
```

Opens at `http://localhost:3000`

> Make sure your backend is running at `http://localhost:8080` first.

## Project Structure

```
src/
├── components/
│   ├── Common/         # Reusable: LoadingSpinner, StatusBadge, Pagination, ConfirmDialog, EmptyState
│   ├── Layout/         # Sidebar, Navbar, Layout wrapper
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx  # Login, logout, user state
├── hooks/
│   └── useTasks.js      # All task CRUD + pagination + filters
├── pages/
│   ├── auth/            # Login, Signup
│   ├── admin/           # Dashboard, Tasks, Users, Stats
│   └── employee/        # Dashboard, MyTasks
├── services/
│   └── api.js           # Axios instance with JWT refresh interceptor
└── utils/
    ├── constants.js
    └── helpers.js
```

## Features

- **Auth**: Login / Signup with auto token refresh
- **Admin**: Full task CRUD, user management, filter tasks, stats with charts
- **Employee**: View assigned tasks, update status
- **Pagination**: Works on all task lists
- **Protected routes**: Role-based access (admin vs employee)

## First Admin Setup

After running the backend, insert an admin user directly into MongoDB:

```js
// Run in mongosh or MongoDB Compass shell
use task_management

db.users.insertOne({
  fullname: "Admin User",
  email: "admin@example.com",
  mobile: "9876543210",
  password: "$2b$12$...",   // use bcrypt hash of your password
  role: "admin",
  refreshToken: null,
  refreshTokenExpiry: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the signup endpoint and then manually update the role in MongoDB.
