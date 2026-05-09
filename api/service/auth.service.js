import UserModel from "../models/User.model.js";
import { generateTokens } from "../utils/token.util.js";
import moment from "moment";
import { TryError } from "../utils/error.util.js";

const signup = async (userData) => {
  const user = await UserModel.create(userData);
  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  };
};

const login = async (email, password) => {
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw TryError("User not found, please signup first", 404);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw TryError("Invalid credentials", 401);
  }

  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  };

  const { accessToken, refreshToken } = generateTokens(payload);
  const refreshTokenExpiry = moment().add(7, "days").toDate();

  await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshToken,
        refreshTokenExpiry,
      },
    }
  );

  return {
    user: payload,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw TryError("Refresh token not found", 401);
  }

  const user = await UserModel.findOne({ refreshToken: refreshTokenValue });

  if (!user) {
    throw TryError("Invalid refresh token", 401);
  }

  const isExpired = moment().isAfter(moment(user.refreshTokenExpiry));

  if (isExpired) {
    throw TryError("Refresh token expired, please login again", 401);
  }

  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  };

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);
  const newRefreshTokenExpiry = moment().add(7, "days").toDate();

  await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshToken: newRefreshToken,
        refreshTokenExpiry: newRefreshTokenExpiry,
      },
    }
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (userId) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        refreshToken: null,
        refreshTokenExpiry: null,
      },
    }
  );
  return true;
};

const getProfile = async (userId) => {
  const user = await UserModel.findById(userId).select("-password -refreshToken -refreshTokenExpiry");
  if (!user) {
    throw TryError("User not found", 404);
  }
  return user;
};

export {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
};