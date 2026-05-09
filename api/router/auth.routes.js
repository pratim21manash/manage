import { Router } from "express";
import * as AuthController from "../controller/auth.controller.js"
import { validate, signupValidation, loginValidation } from "../middleware/validation.middleware.js"
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/signup", validate(signupValidation), AuthController.signup);
router.post("/login", validate(loginValidation), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthMiddleware, AuthController.logout);
router.get("/profile", AuthMiddleware, AuthController.getProfile);

export default router;
