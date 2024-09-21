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

router.get("/room", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result = await connection.execute(
      `SELECT r.room_id, 
              r.room_name, 
              r.amount, 
              r.detail, 
              b.build_id,
              b.build_name,
              f.floor_id, 
              f.floor_name, 
              t.type_name, 
              s.stroom_name, 
              e.fname, 
              e.lname
      FROM room r
      JOIN build b ON b.build_id = r.build_id
      JOIN floor f ON f.floor_id = r.floor_id
      JOIN type t ON t.type_id = r.type_id
      JOIN statusroom s ON s.stroom_id = r.stroom_id
      JOIN employee e ON e.emp_id = r.emp_id`
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
