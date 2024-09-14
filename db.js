import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "data", "boss.sqlite");
let pool = [];
const POOL_SIZE = 5;

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

async function openDb() {
  if (pool.length < POOL_SIZE) {
    try {
      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      console.log(`Successfully opened database: ${dbPath}`);
      initDb(db);
      pool.push(db);
      return db;
    } catch (error) {
      console.error(`Failed to open database: ${dbPath}`);
      console.error(`Error details: ${error.message}`);
      throw error;
    }
  } else {
    return pool[Math.floor(Math.random() * POOL_SIZE)];
  }
}

async function initDb(db) {
  console.log("Initializing database tables...");
  try {
    const tables = await db.all(`
      SELECT name FROM sqlite_master WHERE type='table' AND name IN ('Customers', 'Milk', 'Sales', 'Payments');
    `);

    // If tables already exist, skip initialization
    if (tables.length > 0) {
      console.log("Database already initialized.");
      return;
    }

    await db.exec(`
      CREATE TABLE IF NOT EXISTS Customers (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_name TEXT NOT NULL,
        phone TEXT UNIQUE,
        email TEXT
        
      );

      CREATE TABLE IF NOT EXISTS Milk (
        Batch_No INTEGER PRIMARY KEY AUTOINCREMENT,
        Amount NUMERIC,
        Bought_at,
        Date DATETIME,
        Cost NUMERIC,
        Selling_price NUMERIC,
        Amount_Sold NUMERIC,
        Amount_Remaining NUMERIC
      );

      CREATE TABLE IF NOT EXISTS Sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Milk_Ordered NUMERIC,
        Bought_At NUMERIC,
        Total_Cost NUMERIC,
        Buyer TEXT,
        Payer TEXT,
        Date_Sold DATETIME,
        Date_Paid DATETIME,
        Amount_Paid NUMERIC,
        Amount_Owed NUMERIC,
        Batch_No INTEGER,
        Payment_Status BOOLEAN DEFAULT FALSE,
        Customer_id INTEGER,
        Payment_id INTEGER,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
        FOREIGN KEY (Payment_id) REFERENCES Payments(id)
      );

      CREATE TABLE IF NOT EXISTS Payments(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Paid_by TEXT NOT NULL,
      Amount_Paid NUMERIC,
      Time DATETIME,
      isReconcilled BOOLEAN DEFAULT FALSE,
      Transaction_ID TEXT
      );
    `);
    console.log("All tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
}

async function query(sql, params = []) {
  const db = await openDb();
  try {
    return await db.all(sql, params);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

async function run(sql, params = []) {
  const db = await openDb();
  try {
    return await db.run(sql, params);
  } catch (error) {
    console.error("Database run error:", error);
    throw error;
  }
}

export { query, run };
