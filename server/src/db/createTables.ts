import pool from './pool';

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      )
    `);

    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating users table:', err);
  } finally {
    client.release();
  }
};

createTables().finally(() => pool.end());
