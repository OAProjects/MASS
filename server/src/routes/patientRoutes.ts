import express from "express";
import {
  getPatients,
  createPatientProfile,
  updatePatientProfile,
} from "../controllers/patientsController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Patient routes

router.get("/", getPatients);
router.post("/profile", authenticateToken, createPatientProfile);
router.put("/profile/:id", authenticateToken, updatePatientProfile);

export default router;
