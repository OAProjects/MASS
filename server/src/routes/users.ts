import express, { Request, Response } from "express";
import pool from "../db/pool";
import { User } from "../models/user";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
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
});

router.get("/api", async (req: Request, res: Response) => {
    console.log("WORKS")
    res.status(200).json({message: "Works well mate"})
});


export default router;
