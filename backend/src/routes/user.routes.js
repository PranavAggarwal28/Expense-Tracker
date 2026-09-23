import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", verifyJwt, logoutUser);
router.get("/profile", verifyJwt, getProfile);

export default router;
