// controllers/appointmentController.ts
import { Request, Response } from "express";
import pool from "../db/pool";
import { Appointment } from "../models/Appointment";

// Custom error type for better TypeScript error handling
interface CustomError extends Error {
  message: string;
  stack?: string;
}

// POST Create a new appointment
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  const { patient_id, doctor_id, appointment_date, reason, status } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING appointment_id, patient_id, doctor_id, appointment_date, reason, status, created_at`,
      [patient_id, doctor_id, appointment_date, reason, status]
    );
    const newAppointment: Appointment = result.rows[0];
    client.release();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    const error = err as CustomError;
    console.error("Error creating appointment:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
};

// GET Retrieve all appointments
export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM appointments`);
    const appointments = result.rows;
    client.release();

    res.json(appointments);
  } catch (err) {
    const error = err as CustomError;
    console.error("Error fetching appointments:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

// GET Retrieve appointments by status
export const getAppointmentsByStatus = async (req: Request, res: Response): Promise<void> => {
  const status = req.params.status;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM appointments WHERE status = $1`,
      [status]
    );
    const appointments = result.rows;
    client.release();

    res.json(appointments);
  } catch (err) {
    const error = err as CustomError;
    console.error("Error fetching appointments by status:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error fetching appointments by status", error: error.message });
  }
};

// PUT Update an appointment
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  const appointmentId = parseInt(req.params.appointment_id);
  const { appointment_date, reason, status } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE appointments 
       SET appointment_date = $1, reason = $2, status = $3 
       WHERE appointment_id = $4
       RETURNING appointment_id, patient_id, doctor_id, appointment_date, reason, status, created_at`,
      [appointment_date, reason, status, appointmentId]
    );
    const updatedAppointment: Appointment = result.rows[0];
    client.release();

    res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (err) {
    const error = err as CustomError;
    console.error("Error updating appointment:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
};

// DELETE Delete an appointment
export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  const appointmentId = parseInt(req.params.appointment_id);

  try {
    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM appointments 
       WHERE appointment_id = $1
       RETURNING appointment_id, patient_id, doctor_id, appointment_date, reason, status, created_at`,
      [appointmentId]
    );
    const deletedAppointment: Appointment = result.rows[0];
    client.release();

    res.json({
      message: "Appointment deleted successfully",
      appointment: deletedAppointment,
    });
  } catch (err) {
    const error = err as CustomError;
    console.error("Error deleting appointment:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};

// GET Retrieve upcoming appointments
export const getUpcomingAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM appointments WHERE status = 'upcoming'`);
    const appointments = result.rows;
    client.release();

    res.json(appointments);
  } catch (err) {
    const error = err as CustomError;
    console.error("Error fetching upcoming appointments:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error fetching upcoming appointments", error: error.message });
  }
};

// GET Retrieve canceled appointments
export const getCanceledAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM appointments WHERE status = 'canceled'`);
    const appointments = result.rows;
    client.release();

    res.json(appointments);
  } catch (err) {
    const error = err as CustomError;
    console.error("Error fetching canceled appointments:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error fetching canceled appointments", error: error.message });
  }
};

// GET Retrieve past appointments
export const getPastAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM appointments WHERE status = 'past'`);
    const appointments = result.rows;
    client.release();

    res.json(appointments);
  } catch (err) {
    const error = err as CustomError;
    console.error("Error fetching past appointments:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error fetching past appointments", error: error.message });
  }
};
