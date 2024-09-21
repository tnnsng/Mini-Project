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

const moment = require("moment-timezone");

router.get("/booking", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result = await connection.execute(
      `SELECT book_id, book_date, startdate, enddate, r.room_id, r.room_name, app.app_name, emp.fname, emp.lname 
        FROM BOOKING b
        JOIN room r ON r.room_id = b.room_id
        JOIN statusapproved app ON app.app_id = b.app_id
        JOIN employee emp ON emp.emp_id = b.emp_id`
    );

    // กำหนดชื่อคอลัมน์ (header) จาก metadata ของคอลัมน์ใน result
    const headers = result.metaData.map((col) => col.name);

    // แปลงแถวข้อมูลเป็น JSON
    const rows = result.rows.map((row) => {
      let rowData = {};
      row.forEach((cell, index) => {
        rowData[headers[index]] = cell;
      });

      // แปลง startdate และ enddate เป็นเขตเวลา Bangkok
      rowData.STARTDATE = moment(rowData.STARTDATE)
        .tz("Asia/Bangkok")
        .format("DD-MM-YYYY HH:mm");
      rowData.ENDDATE = moment(rowData.ENDDATE)
        .tz("Asia/Bangkok")
        .format("DD-MM-YYYY HH:mm");

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
