import express from "express";
import {
  getUsers,
  createUser,
  updateUserPassword,
  deleteUser
} from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id/password", updateUserPassword); 
router.delete("/:id", deleteUser);

export default router;
