const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const PORT = 5000;
try {
  // กำหนด path ไปยังโฟลเดอร์ที่ติดตั้ง Oracle Instant Client
  oracledb.initOracleClient({ libDir: "C://instantclient_12_1" });
} catch (err) {
  console.error("Whoops! Error initializing Oracle Client:", err);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  user: "db671086",
  password: "54064",
  connectString: "203.188.54.7:1521/database",
};

// Function to get a database connection
async function getDbConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error("Failed to connect to database", err);
    throw err;
  }
}

app.get("/emp", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง EMPLOYEE
    const result = await connection.execute("SELECT * FROM EMPLOYEE");

    // กำหนดชื่อคอลัมน์ (header) จาก metadata ของคอลัมน์ใน result
    const headers = result.metaData.map((col) => col.name);

    // แปลงแถวข้อมูลเป็น JSON
    const rows = result.rows.map((row) => {
      let rowData = {};
      row.forEach((cell, index) => {
        rowData[headers[index]] = cell;
      });
      return rowData;
    });

    // ส่งผลลัพธ์เป็น JSON
    res.json(rows);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
