import express from "express";
import {
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

export default router;