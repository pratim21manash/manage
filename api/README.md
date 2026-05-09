# Task Management Backend

This is a simple Task Management Backend API built using Node.js, Express.js and MongoDB.

## Features

- User Signup
- User Login
- JWT Authentication
- Refresh Token
- Role Based Access
- Create Task
- Update Task
- Delete Task
- Get All Tasks
- Task Status
- Validation
- Error Handling

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator

---

# Folder Structure

backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── .env
├── package.json
└── server.js

---

API routes for auth
| Method | Route             | Description |
| ------ | ----------------- | ----------- |
| POST   | /api/auth/signup  | Signup User |
| POST   | /api/auth/login   | Login User  |
| POST   | /api/auth/logout  | Logout User |
| GET    | /api/auth/profile | Get Profile |



api routes for task
| Method | Route             | Description |
| ------ | ----------------- | ----------- |
| POST   | /api/auth/signup  | Signup User |
| POST   | /api/auth/login   | Login User  |
| POST   | /api/auth/logout  | Logout User |
| GET    | /api/auth/profile | Get Profile |



User Roles
Admin
Employee
Authentication

This project uses:

JWT Access Token
Refresh Token
HTTP Only Cookies
