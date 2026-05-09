import jwt from "jsonwebtoken"
import { v4 as uuid} from "uuid"
import moment from "moment"


export const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
    })

    const refreshToken = uuid();

    return {
        accessToken,
        refreshToken
    }
}


export const verifyAccessToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    }
    catch(error){
        throw new Error("Invalid or expired token")
    }
}


export const getCookieOptions = (tokenType) => {
    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = tokenType === "access" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge
    }
}

