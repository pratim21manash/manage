import TaskModel from "../models/Task.model.js";
import UserModel from "../models/User.model.js";
import { TryError } from "../utils/error.util.js";
import mongoose from "mongoose";

const createTask = async (taskData, createdBy) => {
  const { assignedTo } = taskData;

  const user = await UserModel.findById(assignedTo);
  if (!user) {
    throw TryError("Assigned user not found", 404);
  }

  const task = await TaskModel.create({
    ...taskData,
    createdBy,
  });

  return await task.populate("assignedTo", "fullname email mobile").populate("createdBy", "fullname email");
};

const getAllTasks = async (userId, userRole, filters = {}, page = 1, limit = 10) => {
  let query = {};

  if (userRole === "employee") {
    query = { assignedTo: userId };
  }

  if (filters.status && ["pending", "in_progress", "completed"].includes(filters.status)) {
    query.status = filters.status;
  }

  if (filters.assignedTo && userRole === "admin" && mongoose.Types.ObjectId.isValid(filters.assignedTo)) {
    query.assignedTo = filters.assignedTo;
  }

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    TaskModel.find(query)
      .populate("assignedTo", "fullname email mobile")
      .populate("createdBy", "fullname email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    TaskModel.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

const getTaskById = async (taskId, userId, userRole) => {
  const task = await TaskModel.findById(taskId)
    .populate("assignedTo", "fullname email mobile")
    .populate("createdBy", "fullname email");

  if (!task) {
    throw TryError("Task not found", 404);
  }

  if (userRole === "employee" && task.assignedTo._id.toString() !== userId) {
    throw TryError("You don't have permission to view this task", 403);
  }

  return task;
};

const updateTask = async (taskId, updateData, userId, userRole) => {
  const task = await TaskModel.findById(taskId);

  if (!task) {
    throw TryError("Task not found", 404);
  }

  if (userRole === "employee") {
    if (task.assignedTo.toString() !== userId) {
      throw TryError("You can only update your own tasks", 403);
    }

    if (updateData.status) {
      await TaskModel.updateOne({ _id: taskId }, { $set: { status: updateData.status } });
      return await getTaskById(taskId, userId, userRole);
    }
    throw TryError("Employees can only update task status", 403);
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "fullname email mobile")
    .populate("createdBy", "fullname email");

  return updatedTask;
};

const deleteTask = async (taskId, userRole) => {
  if (userRole !== "admin") {
    throw TryError("Only admin can delete tasks", 403);
  }

  const task = await TaskModel.findByIdAndDelete(taskId);
  if (!task) {
    throw TryError("Task not found", 404);
  }

  return true;
};

const getTaskStats = async (userId, userRole) => {
  let query = {};

  if (userRole === "employee") {
    // Fix: Cast userId to ObjectId for aggregation pipeline
    query = { assignedTo: new mongoose.Types.ObjectId(userId) };
  }

  const stats = await TaskModel.aggregate([
    { $match: query },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const result = {
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
  };

  stats.forEach((stat) => {
    if (stat._id === "pending") result.pending = stat.count;
    if (stat._id === "in_progress") result.in_progress = stat.count;
    if (stat._id === "completed") result.completed = stat.count;
    result.total += stat.count;
  });

  return result;
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};