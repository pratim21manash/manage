import { Schema,model } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "fullname is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        trim: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee",
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    refreshTokenExpiry: {
        type: Date,
        default: null
    }
}, {timestamps:true})

userSchema.pre("save", async function(){
    if(!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 12);
})

const UserModel = model("User", userSchema)
export default UserModel