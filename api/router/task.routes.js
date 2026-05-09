import { Router } from "express";
const router = Router();

import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTaskStats } from "../controller/task.controller.js";
import { AdminMiddleware, EmployeeMiddleware } from "../middleware/auth.middleware.js";
import {
  validate,
  taskValidation,
  taskStatusValidation,
  taskFiltersValidation,
} from "../middleware/validation.middleware.js";

router.post("/", AdminMiddleware, validate(taskValidation), createTask);
router.delete("/:id", AdminMiddleware, deleteTask);

router.get("/", EmployeeMiddleware, validate(taskFiltersValidation), getAllTasks);
router.get("/stats", EmployeeMiddleware, getTaskStats);
router.get("/:id", EmployeeMiddleware, getTaskById);
router.put("/:id", EmployeeMiddleware, validate(taskStatusValidation), updateTask);

export default router;
