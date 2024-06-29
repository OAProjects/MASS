import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../db/pool";
import { User } from "../models/User";

// GET all users route
export const getUsers = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const users: User[] = result.rows;
    client.release();
    res.json(users);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ message: "Error executing query" });
  }
};

// POST Register user route
export const createUser = async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    role,
    first_name,
    last_name,
    date_of_birth,
    gender,
  }: User = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO users (username, password, email, role, first_name, last_name, date_of_birth, gender) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING user_id, username, email, role, first_name, last_name, date_of_birth, gender, created_at`,
      [
        username,
        hashedPassword,
        email,
        role,
        first_name,
        last_name,
        date_of_birth,
        gender,
      ]
    );
    const newUser: User = result.rows[0];
    client.release();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ message: "Error creating user" });
  }
};

// PUT Update password route
export const updateUserPassword = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { newPassword }: User = req.body;

  try {
    if (!newPassword || newPassword.trim().length === 0) {
      return res.status(400).json({ message: "New password is required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE users 
         SET password = $1
         WHERE user_id = $2
         RETURNING user_id, username, email, role, first_name, last_name, date_of_birth, gender, created_at`,
      [hashedPassword, userId]
    );
    const updatedUser: User = result.rows[0];
    client.release();
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating password", err);
    res.status(500).json({ message: "Error updating password" });
  }
};

// DELETE user route
export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
  
    try {
      const client = await pool.connect();
      const result = await client.query(
        `DELETE FROM users 
         WHERE user_id = $1
         RETURNING user_id, username, email, role, first_name, last_name, date_of_birth, gender, created_at`,
        [userId]
      );
      const deletedUser = result.rows[0];
      client.release();
      
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully", deletedUser });
    } catch (err) {
      console.error("Error deleting user", err);
      res.status(500).json({ message: "Error deleting user" });
    }
  };