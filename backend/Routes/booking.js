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

router.post("/booking", async (req, res) => {
  let connection;
  try {
    const { book_date, startdate, enddate, room_id, app_id, emp_id } = req.body;

    // เชื่อมต่อกับฐานข้อมูลก่อนทำการ query ใดๆ
    connection = await getDbConnection();

    // ค้นหาหมายเลขผู้ใช้ล่าสุด
    const result = await connection.execute(
      `SELECT BOOK_ID FROM (SELECT BOOK_ID FROM BOOKING ORDER BY BOOK_ID DESC) WHERE ROWNUM = 1`
    );

    let rows = result.rows;
    let newBookingID = "B0001"; // ค่าปริยายถ้าไม่มีผู้ใช้ในฐานข้อมูล

    if (rows.length > 0) {
      const lastBookingID = rows[0][0]; // ดึง BOOK_ID จากแถวแรก
      const lastNumber = parseInt(lastBookingID.substring(1), 10);
      const newNumber = lastNumber + 1;
      newBookingID = `B${newNumber.toString().padStart(4, "0")}`;
    }

    // Validate input data
    if (
      !newBookingID ||
      !book_date ||
      !startdate ||
      !enddate ||
      !room_id ||
      !app_id ||
      !emp_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Prepare the SQL query
    const insertQuery = `
      INSERT INTO booking (book_id, book_date, startdate, enddate, room_id, app_id, emp_id)
      VALUES (:book_id, TO_DATE(:book_date, 'YYYY-MM-DD HH24:MI'), TO_DATE(:startdate, 'YYYY-MM-DD HH24:MI'), TO_DATE(:enddate, 'YYYY-MM-DD HH24:MI'), :room_id, :app_id, :emp_id)
    `;

    const resultInsert = await connection.execute(insertQuery, {
      book_id: newBookingID,
      book_date,
      startdate,
      enddate,
      room_id,
      app_id,
      emp_id,
    });

    await connection.commit();

    res.status(201).json({
      message: "Booking created successfully",
      book_id: newBookingID,
    });
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

router.put("/booking/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามี id หรือไม่
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const { book_date, startdate, enddate, room_id, app_id, emp_id } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !book_date ||
      !startdate ||
      !enddate ||
      !room_id ||
      !app_id ||
      !emp_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // เตรียมคำสั่ง SQL สำหรับอัปเดต
    const result = await connection.execute(
      `UPDATE Booking SET 
        book_date = TO_DATE(:book_date, 'YYYY-MM-DD HH24:MI'),
        startdate = TO_DATE(:startdate, 'YYYY-MM-DD HH24:MI'),
        enddate = TO_DATE(:enddate, 'YYYY-MM-DD HH24:MI'),
        room_id = :room_id,
        app_id = :app_id,
        emp_id = :emp_id
      WHERE book_id = :book_id`,
      {
        book_date,
        startdate,
        enddate,
        room_id,
        app_id,
        emp_id,
        book_id: id,
      }
    );

    await connection.commit();

    // ตรวจสอบจำนวนแถวที่ถูกอัปเดต
    const affectedRows = result.rowsAffected || 0;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "booking not found" });
    }

    // ส่งผลลัพธ์กลับ
    res.status(200).json({ message: "booking updated successfully" });
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

router.delete("/booking/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    connection = await getDbConnection();

    const result = await connection.execute(
      `DELETE FROM booking WHERE book_id = :book_id`,
      { book_id: id }
    );

    await connection.commit();
    // Access rowsAffected directly from the result
    const affectedRows = result.rowsAffected;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "booking not found" });
    }

    res.status(200).json({ message: "booking deleted successfully" });
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
