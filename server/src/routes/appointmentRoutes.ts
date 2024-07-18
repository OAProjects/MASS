// routes/appointmentRoutes.ts
import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentsByStatus,
  getUpcomingAppointments,
  getCanceledAppointments,
  getPastAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/status/:status", getAppointmentsByStatus);
router.get("/upcoming", getUpcomingAppointments);
router.get("/canceled", getCanceledAppointments);
router.get("/past", getPastAppointments);
router.put("/:appointment_id", updateAppointment);
router.delete("/:appointment_id", deleteAppointment);

export default router;
