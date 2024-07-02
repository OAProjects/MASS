import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("Environment variables:");
console.log(`POSTGRES_USER: ${process.env.POSTGRES_USER}`);
console.log(`POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD}`);
console.log(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "postgres",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export default pool;
