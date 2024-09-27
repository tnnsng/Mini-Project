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

router.get("/cancle", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result = await connection.execute("SELECT * FROM cancle");

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

router.post("/cancle/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params; // Extract id from params

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { cancle_date, reason, emp_id } = req.body;
    if (!cancle_date || !reason || !emp_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Connect to the database
    connection = await getDbConnection();


    const timeCheck = await connection.execute(
      `SELECT book_id 
       FROM booking 
       WHERE book_id = :book_id 
       AND SYSDATE < startdate + INTERVAL '10' MINUTE`,
      { book_id: id }
    );
    
    const book_id = timeCheck.rows.length > 0 ? timeCheck.rows[0][0] : null;
    if (!book_id) {
      return res.status(401).json({ error: "Time Out" });
    }
    // Insert cancellation record
    const result = await connection.execute(
      `INSERT INTO cancle (cancle_date, book_id, reason, emp_id)
       VALUES (TO_DATE(:cancle_date, 'YYYY-MM-DD HH24:MI'), :book_id, :reason, :emp_id)`,
      {
        cancle_date,
        book_id: book_id,
        reason,
        emp_id,
      }
    );

    const status = 'SA005';
    // Update booking status
    const result2 = await connection.execute(
      `UPDATE Booking SET app_id = :app_id WHERE book_id = :book_id`,
      {
        app_id: status,
        book_id: id,
      }
    );

    // Commit the transaction
    await connection.commit();

    // Check if any rows were affected
    const affectedRows = result.rowsAffected || result2.rowsAffected || 0;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Cancellation not found or not updated" });
    }

    res.status(200).json({ message: "Cancellation updated successfully" });
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
