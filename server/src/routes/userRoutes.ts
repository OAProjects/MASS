import express from "express";
import {
  getUserDetails,
  getUsers,
  createUser,
  loginUser,
  updateUserPassword,
  deleteUser
} from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// User routes

router.get("/", getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id/password", authenticateToken, updateUserPassword); 
router.delete("/:id", deleteUser);
router.get("/me", authenticateToken, getUserDetails); // New route for user details

export default router;