import { createTask as createTaskService, getAllTasks as getAllTasksService, getTaskById as getTaskByIdService, updateTask as updateTaskService, deleteTask as deleteTaskService, getTaskStats as getTaskStatsService } from "../service/task.service.js";
import { CatchError } from "../utils/error.util.js";

const createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.body, req.user.id);
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    CatchError(err, res, "Failed to create task");
  }
};

const getAllTasks = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      assignedTo: req.query.assignedTo,
    };
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllTasksService(req.user.id, req.user.role, filters, page, limit);

    res.json(result);
  } catch (err) {
    CatchError(err, res, "Failed to fetch tasks");
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await getTaskByIdService(req.params.id, req.user.id, req.user.role);
    res.json(task);
  } catch (err) {
    CatchError(err, res, "Failed to fetch task");
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await updateTaskService(req.params.id, req.body, req.user.id, req.user.role);
    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    CatchError(err, res, "Failed to update task");
  }
};

const deleteTask = async (req, res) => {
  try {
    await deleteTaskService(req.params.id, req.user.role);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    CatchError(err, res, "Failed to delete task");
  }
};

const getTaskStats = async (req, res) => {
  try {
    const stats = await getTaskStatsService(req.user.id, req.user.role);
    res.json(stats);
  } catch (err) {
    CatchError(err, res, "Failed to fetch task stats");
  }
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};
