import express from "express";
import { getAllUsers, createUser } from "../controllers/userController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", createUser);

export default router;
