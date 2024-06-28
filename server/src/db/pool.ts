import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',  // Docker service name
  database: 'MASS_DB', // Replace with your desired database name
  password: '1234',
  port: 5432,
});

export default pool;
