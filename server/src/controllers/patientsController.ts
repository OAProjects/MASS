import { Request, Response } from "express";
import pool from "../db/pool";
import { Patient } from "../models/Patient";
import dotenv from "dotenv";

dotenv.config();

// GET all patients route
export const getPatients = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM patients");
    const patients: Patient[] = result.rows;
    client.release();
    res.json(patients);
  } catch (err) {
    console.error("Error retrieving patients", err);
    res.status(500).json({ message: "Error retrieving patients" });
  }
};

// POST create patient profile route
export const createPatientProfile = async (req: Request, res: Response) => {
  const { first_name, last_name, date_of_birth, gender }: Patient = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID" });
  }

  try {
    const client = await pool.connect();

    // Check if a profile already exists
    const existingProfile = await client.query(
      `SELECT * FROM patients WHERE user_id = $1`,
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const result = await client.query(
      `INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, first_name, last_name, date_of_birth, gender]
    );

    const newPatient: Patient = result.rows[0];
    client.release();

    res.status(201).json({
      message: "Patient profile created successfully",
      patient: newPatient,
    });
  } catch (err) {
    console.error("Error creating patient profile", err);
    res.status(500).json({ message: "Error creating patient profile" });
  }
};

// PUT update patient profile
export const updatePatientProfile = async (req: Request, res: Response) => {
  const patientId = req.params.id;
  const { first_name, last_name, date_of_birth, gender }: Partial<Patient> =
    req.body;

  // Check if req.user is defined
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await pool.connect();

    // Ensure the patient belongs to the authenticated user
    const patientResult = await client.query(
      `SELECT * FROM patients WHERE patient_id = $1 AND user_id = $2`,
      [patientId, req.user.id]
    );

    if (patientResult.rows.length === 0) {
      client.release();
      return res.status(404).json({
        message:
          "Patient not found or does not belong to the authenticated user",
      });
    }

    const result = await client.query(
      `UPDATE patients 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           date_of_birth = COALESCE($3, date_of_birth),
           gender = COALESCE($4, gender)
       WHERE patient_id = $5 AND user_id = $6
       RETURNING *`,
      [first_name, last_name, date_of_birth, gender, patientId, req.user.id]
    );

    const updatedPatient = result.rows[0];
    client.release();

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(201).json({
      message: "Patient profile updated successfully",
      patient: updatedPatient,
    });
  } catch (err) {
    console.error("Error updating patient profile", err);
    res.status(500).json({ message: "Error updating patient profile" });
  }
};
