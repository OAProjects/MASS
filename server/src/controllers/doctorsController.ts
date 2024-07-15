import { Request, Response } from "express";
import pool from "../db/pool";
import { Doctor } from "../models/Doctor";
import dotenv from "dotenv";

dotenv.config();

// GET all doctors route
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM doctors");
    const doctors: Doctor[] = result.rows;
    client.release();
    res.json(doctors);
  } catch (err) {
    console.error("Error retrieving doctors", err);
    res.status(500).json({ message: "Error retrieving doctors" });
  }
};

// POST create doctor profile route
export const createDoctorProfile = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    specialisation,
  }: Doctor = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID" });
  }

  try {
    const client = await pool.connect();

    // Check if a profile already exists
    const existingProfile = await client.query(
      `SELECT * FROM doctors WHERE user_id = $1`,
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const result = await client.query(
      `INSERT INTO doctors (user_id, first_name, last_name, date_of_birth, gender, specialisation) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, first_name, last_name, date_of_birth, gender, specialisation]
    );

    const newDoctor: Doctor = result.rows[0];
    client.release();

    res.status(201).json({
      message: "Doctor profile created successfully",
      doctor: newDoctor,
    });
  } catch (err) {
    console.error("Error creating doctor profile", err);
    res.status(500).json({ message: "Error creating doctor profile" });
  }
};


// PUT update doctor profile
export const updateDoctorProfile = async (req: Request, res: Response) => {
  const doctorId = req.params.id;
  const { first_name, last_name, date_of_birth, gender, specialisation }: Partial<Doctor> =
    req.body;

  // Check if req.user is defined
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await pool.connect();

    // Ensure the doctor belongs to the authenticated user
    const doctorResult = await client.query(
      `SELECT * FROM doctors WHERE doctor_id = $1 AND user_id = $2`,
      [doctorId, req.user.id]
    );

    if (doctorResult.rows.length === 0) {
      client.release();
      return res
        .status(404)
        .json({
          message:
            "Doctor not found or does not belong to the authenticated user",
        });
    }

    const result = await client.query(
      `UPDATE doctors
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           date_of_birth = COALESCE($3, date_of_birth),
           gender = COALESCE($4, gender)
					 specialisation = COALESCE($5, specialisation)
       WHERE doctor_id = $6 AND user_id = $7
       RETURNING *`,
      [first_name, last_name, date_of_birth, gender, specialisation, doctorId, req.user.id]
    );

    const updatedDoctor = result.rows[0];
    client.release();

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(updatedDoctor);
  } catch (err) {
    console.error("Error updating doctor profile", err);
    res.status(500).json({ message: "Error updating doctor profile" });
  }
};
