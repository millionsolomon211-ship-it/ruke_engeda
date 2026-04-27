const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  console.log("Connecting to DATABASE_URL...");
  try {
    await client.connect();
    console.log("Connected successfully to DATABASE_URL!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error on DATABASE_URL:", err.message);
  }

  const client2 = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  console.log("\nConnecting to DIRECT_URL...");
  try {
    await client2.connect();
    console.log("Connected successfully to DIRECT_URL!");
    const res = await client2.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client2.end();
  } catch (err) {
    console.error("Connection error on DIRECT_URL:", err.message);
  }
}

testConnection();
