import express from "express";
import {
  getUsers,
  createUser,
  loginUser,
  updateUserPassword,
  deleteUser
} from "../controllers/userController";
import {
  getPatients,
  createPatientProfile,
  updatePatientProfile
} from "../controllers/patientsController";
// import {
//   getDoctors,
//   createDoctorProfile,
//   updateDoctorProfile
// } from "../controllers/doctorsController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// User routes

router.get("/", getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id/password", authenticateToken, updateUserPassword); 
router.delete("/:id", deleteUser);

// Patient routes

router.get("/profile", getPatients);
router.post("/profile", authenticateToken, createPatientProfile);
router.put("/:id/profile", authenticateToken, updatePatientProfile);

// Doctor routes

// router.get("/doctor", getDoctors);
// router.post("/doctor", createDoctorProfile);
// router.put("/:id/profile", updateDoctorProfile);

export default router;
