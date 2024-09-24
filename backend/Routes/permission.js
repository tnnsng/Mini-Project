const express = require("express");
const router = express.Router();
const db = require("../Database/db");
const oracledb = require("oracledb");
// Function to get a database connection
async function getDbConnection() {
  try {
    const connection = await oracledb.getConnection(db);
    return connection;
  } catch (err) {
    console.error("Failed to connect to database", err);
    throw err;
  }
}
router.get("/permission", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();
    // ดึงข้อมูลจากตาราง EMPLOYEE
    const result = await connection.execute("SELECT * FROM permission");
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

router.get("/perposition/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params; // ดึง id ที่จะลบจาก URL
    if (!id) {
      return res.status(400).json({ error: "build_id is required" });
    }
    connection = await getDbConnection();
    // ดึงข้อมูลจากตาราง EMPLOYEE
    const result = await connection.execute(
      "SELECT * FROM perposition WHERE POSI_ID = :id",
      { id }
    );
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

module.exports = router;
