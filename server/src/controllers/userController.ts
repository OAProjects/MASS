import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool";
import { User } from "../models/User";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";

dotenv.config();
const { JWT_SECRET } = process.env;

// Function to generate JWT
const generateAccessToken = (user: User) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

// GET all users route
export const getUsers = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    // Fetch all users
    const usersResult = await client.query(
      "SELECT user_id, email, role, created_at FROM users"
    );
    const users: User[] = usersResult.rows;

    // Fetch all profiles
    const profilesResult = await client.query("SELECT * FROM patients");
    const profiles = profilesResult.rows;

    client.release();

    // Combine users and profiles
    const usersWithProfiles = users.map((user) => {
      const profile =
        profiles.find((profile) => profile.user_id === user.user_id) || null;
      return { ...user, profile };
    });

    res.json(usersWithProfiles);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ message: "Error executing query" });
  }
};

// POST Register user route
export const createUser = [
  // Express validator for inputs
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  body("role").notEmpty().withMessage("Role is required"),

  async (req: Request, res: Response) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, role }: User = req.body;

    try {
      const client = await pool.connect();

      // Check if the user already exists through the email
      const alreadyUser = await client.query(
        `SELECT email FROM users WHERE email = $1`,
        [email]
      );

      // If the email already exists, return an error
      if (alreadyUser.rows.length > 0) {
        client.release();
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await client.query(
        `INSERT INTO users (email, password, role) 
         VALUES ($1, $2, $3)
         RETURNING user_id, email, role, created_at`,
        [email, hashedPassword, role]
      );
      const newUser: User = result.rows[0];
      client.release();

      const token = generateAccessToken(newUser);
      // Set the token in the Authorization header
      res.setHeader('Authorization', `Bearer ${token}`);

      // Only returns the email, role in the response body
      res.status(201).json({
        message: "User registered successfully",
        email: newUser.email,
        role: newUser.role,
        token,
      });
    } catch (err) {
      console.error("Error creating user", err);
      res.status(500).json({ message: "Error creating user" });
    }
  },
];

// POST Login route
export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user: User = result.rows[0];
    client.release();

    // If the user is not found, return an error
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the password with the hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    // If the password is invalid, return an error
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT for the user
    const token = generateAccessToken(user);
    // Set the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Only returns the email, role, and token in the response
    res.status(200).json({
      message: "User logged in successfully",
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Error logging in user", err);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// PUT Update password route
export const updateUserPassword = [
  // Express validator for inputs
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  async (req: Request, res: Response) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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
         RETURNING user_id, email, role, created_at`,
        [hashedPassword, userId]
      );
      const updatedUser: User = result.rows[0];
      client.release();
      res.json(updatedUser);
    } catch (err) {
      console.error("Error updating password", err);
      res.status(500).json({ message: "Error updating password" });
    }
  },
];

// DELETE user route
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM users 
         WHERE user_id = $1
         RETURNING user_id, email, role, created_at`,
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
