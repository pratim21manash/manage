import UserModel from "../models/User.model.js";
import moment from "moment";
import { TryError } from "../utils/error.util.js";
import { generateTokens } from "../utils/token.util.js";


export const signup = async (userData) => {
    const user = await UserModel.create(userData);
    return {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        role: user.role
    }
}


export const login = async (email, password) => {
    const user = await UserModel.findOne({email}).select('+password');

    if(!user){
        throw TryError("User not found, please signup first", 404)
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        throw TryError("Invalid credentials", 401)
    }

    const payload = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        role: user.role
    }

    const {accessToken, refreshToken} = generateTokens(payload)
    const refreshTokenExpiry = moment().add(7, 'days').toDate()

    await UserModel.updateOne(
        {_id: user._id},
        {
            $set: {
                refreshToken,
                refreshTokenExpiry
            }
        }
    );

    return {
        user: payload,
        accessToken,
        refreshToken
    }
}