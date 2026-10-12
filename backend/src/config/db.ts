import mysql from 'mysql2/promise';
import { ENV } from './env.js';

// Create a connection pool to MySQL / MariaDB
// Using a pool avoids overhead of reconnecting on every query
export const pool = mysql.createPool({
  host: ENV.DB.HOST,
  port: ENV.DB.PORT,
  user: ENV.DB.USER,
  password: ENV.DB.PASSWORD,
  database: ENV.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    ENV.DB.HOST !== 'localhost' && ENV.DB.HOST !== '127.0.0.1'
      ? { rejectUnauthorized: false }
      : undefined,
});

/**
 * Test connectivity to the database and print clear guidance if disconnected.
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Connected successfully to MySQL database "${ENV.DB.NAME}" on ${ENV.DB.HOST}:${ENV.DB.PORT}`);
    connection.release();
    return true;
  } catch (error: any) {
    console.warn(`\n------------------------------------------------------------`);
    console.warn(`[Database Warning] Could not connect to MySQL at ${ENV.DB.HOST}:${ENV.DB.PORT}`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`Please ensure MySQL or MariaDB (e.g., via XAMPP or Laragon) is running,`);
    console.warn(`and that the database "${ENV.DB.NAME}" has been initialized with schema.sql.`);
    console.warn(`------------------------------------------------------------\n`);
    return false;
  }
}
