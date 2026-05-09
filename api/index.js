import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

import authRoutes from "./router/auth.routes.js";
import taskRoutes from "./router/task.routes.js";
import userRoutes from "./router/user.routes.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import corsConfig from "./config/cors.js";

connectDB();

const app = express();

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", AuthMiddleware, taskRoutes);
app.use("/api/users", AuthMiddleware, userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
