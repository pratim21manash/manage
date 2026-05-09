import { Router } from "express";
const router = Router();

import { getAllUsers, getEmployees, getUserById, deleteUser } from "../controller/user.controller.js";
import { AdminMiddleware } from "../middleware/auth.middleware.js";

router.get("/", AdminMiddleware, getAllUsers);
router.get("/employees", AdminMiddleware, getEmployees);
router.get("/:id", AdminMiddleware, getUserById);
router.delete("/:id", AdminMiddleware, deleteUser);

export default router;
