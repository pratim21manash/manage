import { verifyAccessToken } from "../utils/token.util.js";
import { CatchError, TryError } from "../utils/error.util.js";

const AuthMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw TryError("Unauthorized: No token provided", 401);
    }

    const payload = verifyAccessToken(accessToken);

    req.user = {
      id: payload.id,
      fullname: payload.fullname,
      email: payload.email,
      mobile: payload.mobile,
      role: payload.role,
    };

    next();
  } catch (err) {
    CatchError(err, res, "Unauthorized: Invalid or expired token");
  }
};

const AdminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

const EmployeeMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "employee")) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Employee access required" });
  }
};

export {
  AuthMiddleware,
  AdminMiddleware,
  EmployeeMiddleware,
};