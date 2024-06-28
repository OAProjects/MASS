import { Request, Response } from "express";
import pool from "../db/pool";
import { User } from "../models/User";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Server error");
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ msg: "Please include name and email" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO users(name, email) VALUES($1, $2) RETURNING *",
      [name, email]
    );
    return res.json(rows[0]);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).send("Server error");
  }
};
