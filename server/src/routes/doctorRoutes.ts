import express from "express";
import {
  getDoctors,
  createDoctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorsController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Doctor routes

router.get("/", getDoctors);
router.post("/profile", authenticateToken, createDoctorProfile);
router.put("/:id/profile", authenticateToken, updateDoctorProfile);

export default router;
