import dotenv from "dotenv"
dotenv.config()

import express from "express"
import connectDB from "./config/database.js"

connectDB()
const app = express()


app.listen(process.env.PORT || 8080, ()=>{
    console.log("Server is running")
})