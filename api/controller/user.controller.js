import { getAllUsers as getAllUsersService, getUserById as getUserByIdService, getEmployees as getEmployeesService, deleteUser as deleteUserService } from "../service/user.service.js";
import { CatchError } from "../utils/error.util.js";

const getAllUsers = async (req, res) => {
  try {
    const role = req.query.role;
    const users = await getAllUsersService(role);
    res.json(users);
  } catch (err) {
    CatchError(err, res, "Failed to fetch users");
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (err) {
    CatchError(err, res, "Failed to fetch user");
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await getEmployeesService();
    res.json(employees);
  } catch (err) {
    CatchError(err, res, "Failed to fetch employees");
  }
};

const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id, req.user.role, req.user.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    CatchError(err, res, "Failed to delete user");
  }
};

export {
  getAllUsers,
  getUserById,
  getEmployees,
  deleteUser,
};
