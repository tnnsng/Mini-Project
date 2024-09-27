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

router.get("/waitapprove", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result = await connection.execute(
      `SELECT B.BOOK_ID, 
                B.ROOM_ID,
                R.ROOM_NAME,
                BU.BUILD_NAME,
                F.FLOOR_NAME,
                B.STARTDATE,
                B.ENDDATE,
                E.EMP_ID
         FROM BOOKING B
         JOIN ROOM R ON B.ROOM_ID = R.ROOM_ID
         JOIN BUILD BU ON R.BUILD_ID = BU.BUILD_ID
         JOIN FLOOR F ON R.FLOOR_ID = F.FLOOR_ID
         JOIN EMPLOYEE E ON R.EMP_ID = E.EMP_ID
         WHERE B.APP_ID = 'SA002'
         ORDER BY B.BOOK_ID`
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

router.post("/approved/:book_id", async (req, res) => {
  let connection;
  try {
    const { book_id } = req.params;

    if (!book_id) {
      return res.status(400).json({ error: "book_id is required" });
    }

    connection = await getDbConnection();

    // อัปเดตสถานะการอนุมัติ
    const status = "SA001";
    await connection.execute(
      "UPDATE Booking SET app_id = :app_id WHERE book_id = :book_id",
      { app_id: status, book_id }
    );

    // ตรวจสอบ QR Code ว่ามีอยู่ในฐานข้อมูลหรือไม่
    const qrCodeExists = await connection.execute(
      "SELECT num FROM qrcode WHERE book_id = :book_id",
      { book_id }
    );

    let randomNumber = Math.floor(100000 + Math.random() * 900000);

    if (qrCodeExists.rows.length === 0) {
      // QR Code ยังไม่มีในฐานข้อมูล ให้แทรกใหม่
      await connection.execute(
        `INSERT INTO qrcode (book_id, num) VALUES (:book_id, :num)`,
        {
          book_id,
          num: randomNumber,
        }
      );
    } else {
      // QR Code มีอยู่แล้วให้ทำการอัปเดต
      await connection.execute(
        `UPDATE qrcode SET num = :num WHERE book_id = :book_id`,
        {
          book_id,
          num: randomNumber,
        }
      );
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      message: "Approved successfully",
      book_id,
      qr_code: randomNumber,
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

router.post("/not-approved", async (req, res) => {
  let connection;
  try {
    const { book_id, reason } = req.body;
    if (!book_id || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    const status = "SA003"; //not_approved

    const result = await connection.execute(
      "UPDATE Booking SET app_id = :app_id WHERE book_id = :book_id",
      { app_id: status, book_id }
    );

    await connection.execute(
      `INSERT INTO  notapproved ( book_id, reason ) VALUES ( :book_id, :reason) `,
      {
        book_id: book_id,
        reason: reason,
      }
    );

    await connection.commit();

    res.status(201).json({
      message: "Not-Approved successfully",
      book_id,
      reason: reason,
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

module.exports = router;
