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
router.post("/report_to", async (req, res) => {
  let connection;
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result = await connection.execute(
      `SELECT 
    COUNT(book_id) AS reserve,
    COUNT(CASE WHEN app_id = 'SA006' THEN 1 END) AS use,
    COUNT(CASE WHEN app_id = 'SA005' THEN 1 END) AS cancel
    FROM booking WHERE 
    EXTRACT(MONTH FROM startdate) = :selected_month 
    AND EXTRACT(YEAR FROM startdate) = :selected_year`,
      {
        selected_month: month,
        selected_year: year,
      }
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

router.get("/report_lock", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result =
      await connection.execute(`SELECT emp.fname, emp.lname, dep.dep_name, dep.dep_id, COUNT(his.emp_id) AS amount
        FROM employee emp
        JOIN department dep ON emp.dep_id = dep.dep_id
        JOIN history_lock his ON emp.emp_id = his.emp_id
        GROUP BY emp.fname, emp.lname, dep.dep_name, dep.dep_id`);
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

// Route: /report_1
router.get("/report_1", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    const { room, month, year } = req.query;

    // Validate input parameters
    if (!room || !month || !year) {
      return res
        .status(400)
        .json({ message: "Please provide room, month, and year parameters." });
    }

    // Ensure month is in 'MM' format (e.g., '09' for September)
    const formattedMonth = month.padStart(2, "0");

    // Query to get booking data based on room, month, and year
    const query = `
      SELECT r.room_name, TO_CHAR(b.startdate, 'YYYY-MM-DD') AS booking_date, COUNT(b.room_id) AS total_bookings
      FROM booking b
      JOIN room r ON b.room_id = r.room_id
      WHERE b.app_id = 'SA006' 
      AND r.room_name = :room 
      AND TO_CHAR(b.startdate, 'MM') = :month 
      AND TO_CHAR(b.startdate, 'YYYY') = :year
      GROUP BY r.room_name, TO_CHAR(b.startdate, 'YYYY-MM-DD')
      ORDER BY TO_CHAR(b.startdate, 'YYYY-MM-DD') ASC
    `;

    // Execute query with parameters
    const result = await connection.execute(query, {
      room: room,
      month: formattedMonth,
      year: year,
    });

    // Check if data is found
    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No data available" }); // Return "ไม่มีข้อมูล" when no results are found
    }

    // Send result as JSON with headers
    res.json({
      headers: result.metaData.map((col) => col.name),
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ message: "Error fetching report data." });
  } finally {
    if (connection) {
      try {
        await connection.close(); // Close database connection
      } catch (error) {
        console.error("Error closing the connection:", error);
      }
    }
  }
});

module.exports = router;
