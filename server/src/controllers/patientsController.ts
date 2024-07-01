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

// POST Create patient profile route
export const createPatientProfile = async (req: Request, res: Response) => {
  const { user_id, first_name, last_name, date_of_birth, gender }: Patient =
    req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
      [user_id, first_name, last_name, date_of_birth, gender]
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
  const { first_name, last_name, date_of_birth, gender }: Partial<Patient> = req.body;

  try {
    const client = await pool.connect();

    // Directly use the provided values or keep the existing ones if not provided
    const result = await client.query(
      `UPDATE patients 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           date_of_birth = COALESCE($3, date_of_birth),
           gender = COALESCE($4, gender)
       WHERE patient_id = $5
       RETURNING patient_id, user_id, first_name, last_name, date_of_birth, gender, created_at`,
      [first_name, last_name, date_of_birth, gender, patientId]
    );

    const updatedPatient = result.rows[0];
    client.release();

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (err) {
    console.error("Error updating patient profile", err);
    res.status(500).json({ message: "Error updating patient profile" });
  }
};