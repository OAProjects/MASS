import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

// Check how to do environment variables because it outputs this
// it works in docker-compose.yml but not in the const pool variable db connection

// Result
// 2024-06-28 21:23:58 app-1       | Environment variables:
// 2024-06-28 21:23:58 app-1       | POSTGRES_USER: undefined
// 2024-06-28 21:23:58 app-1       | POSTGRES_PASSWORD: undefined
// 2024-06-28 21:23:58 app-1       | POSTGRES_DB: undefined

console.log("Environment variables:");
console.log(`POSTGRES_USER: ${process.env.POSTGRES_USER}`);
console.log(`POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD}`);
console.log(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);

const pool = new Pool({
  user: "postgres",
  host: "postgres",
  database: "MASS_DB",
  password: "1234",
  port: 5432,
});

export default pool;
