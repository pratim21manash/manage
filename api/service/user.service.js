import UserModel from "../models/User.model.js";
import TaskModel from "../models/Task.model.js";
import { TryError } from "../utils/error.util.js";

const getAllUsers = async (role = null) => {
  let query = {};
  if (role && ["admin", "employee"].includes(role)) {
    query = { role };
  }

  const users = await UserModel.find(query).select("-password -refreshToken -refreshTokenExpiry");
  return users;
};

const getUserById = async (userId) => {
  const user = await UserModel.findById(userId).select("-password -refreshToken -refreshTokenExpiry");
  if (!user) {
    throw TryError("User not found", 404);
  }
  return user;
};

const getEmployees = async () => {
  const employees = await UserModel.find({ role: "employee" }).select(
    "-password -refreshToken -refreshTokenExpiry"
  );
  return employees;
};

const deleteUser = async (userId, currentUserRole, currentUserId) => {
  if (currentUserRole !== "admin") {
    throw TryError("Only admin can delete users", 403);
  }

  if (userId === currentUserId) {
    throw TryError("You cannot delete your own account", 400);
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw TryError("User not found", 404);
  }

  await TaskModel.deleteMany({
    $or: [{ assignedTo: userId }, { createdBy: userId }],
  });

  await UserModel.findByIdAndDelete(userId);
  return true;
};

export {
  getAllUsers,
  getUserById,
  getEmployees,
  deleteUser,
};