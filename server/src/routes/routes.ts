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

const router = express.Router();

// User routes

router.get("/", getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id/password", updateUserPassword); 
router.delete("/:id", deleteUser);

// Patient routes

router.get("/profile", getPatients);
router.post("/profile", createPatientProfile);
router.put("/:id/profile", updatePatientProfile);

export default router;
