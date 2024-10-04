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

router.get("/use-room/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params; // ดึง id ที่จะลบจาก URL

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const qrCheck = await connection.execute(
      `SELECT book_id FROM qrcode WHERE num = :id `,
      { id }
    );

    const book_id = qrCheck.rows[0][0];
    if (!book_id) {
      return res.status(401).json({ error: "Invalid QR code" });
    }

    // ดึงข้อมูล startdate จาก booking
    const bookingCheck = await connection.execute(
      `SELECT startdate 
   FROM booking 
   WHERE book_id = :book_id`,
      { book_id: book_id }
    );

    // ตรวจสอบว่า bookingCheck มีข้อมูลหรือไม่
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ดึง startdate
    const startdate = bookingCheck.rows[0][0];

    // ตรวจสอบว่ามาใช้ก่อนเวลาเริ่มหรือไม่
    if (startdate > new Date()) {
      // ใช้ new Date() เพื่อเปรียบเทียบกับเวลาปัจจุบัน
      return res
        .status(403)
        .json({ error: "Cannot use the room before the start time" });
    } 

    // จากนั้นดำเนินการต่อเพื่อตรวจสอบเวลาที่หมดอายุ
    const timeCheck = await connection.execute(
      `SELECT book_id 
   FROM booking 
   WHERE book_id = :book_id 
   AND startdate <= SYSDATE + INTERVAL '30' MINUTE`,
      { book_id: book_id }
    );

    const use_id = timeCheck.rows.length > 0 ? timeCheck.rows[0][0] : null;

    if (!use_id) {
      return res.status(401).json({ error: "Time Out" });
    }

    const deleteQr = await connection.execute(
      `DELETE FROM qrcode WHERE book_id = :book_id `,
      { book_id: use_id }
    );
    const addUse = await connection.execute(
      `INSERT INTO user_room (book_id, date_use)
         VALUES (:book_id, SYSDATE)`,
      {
        book_id: use_id,
      }
    );
    const status = "SA006";
    // Update booking status
    const updateRoom = await connection.execute(
      `UPDATE Booking SET app_id = :app_id WHERE book_id = :book_id`,
      {
        app_id: status,
        book_id: use_id,
      }
    );
    await connection.commit();
    const result = await connection.execute(
      `SELECT r.room_name, u.date_use
        FROM Booking b 
        JOIN room r ON r.room_id = b.room_id
        JOIN user_room u ON u.book_id = b.book_id
        WHERE b.book_id = :book_id`,
      {
        book_id: use_id,
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

module.exports = router;
