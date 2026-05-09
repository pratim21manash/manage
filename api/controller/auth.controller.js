import { signup as signupService, login as loginService, refreshToken as refreshTokenService, logout as logoutService, getProfile as getProfileService } from "../service/auth.service.js";
import { CatchError } from "../utils/error.util.js";
import { getCookieOptions } from "../utils/token.util.js";

const signup = async (req, res) => {
  try {
    const userData = {
      ...req.body
    };

    const user = await signupService(userData);
    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (err) {
    CatchError(err, res, "Signup failed");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);

    res.cookie("accessToken", result.accessToken, getCookieOptions("access"));
    res.cookie("refreshToken", result.refreshToken, getCookieOptions("refresh"));

    res.json({
      message: "Login successful",
      user: result.user,
    });
  } catch (err) {
    CatchError(err, res, "Login failed");
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenValue = req.cookies.refreshToken;
    const result = await refreshTokenService(refreshTokenValue);

    res.cookie("accessToken", result.accessToken, getCookieOptions("access"));
    res.cookie("refreshToken", result.refreshToken, getCookieOptions("refresh"));

    res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    CatchError(err, res, "Failed to refresh token");
  }
};

const logout = async (req, res) => {
  try {
    await logoutService(req.user.id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
  } catch (err) {
    CatchError(err, res, "Logout failed");
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await getProfileService(req.user.id);
    res.json(profile);
  } catch (err) {
    CatchError(err, res, "Failed to fetch profile");
  }
};

export {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
};
