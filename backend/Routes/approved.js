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

router.post("/approved/:book_id", async (req, res) => {
  let connection;
  try {
    const { book_id } = req.params; // ดึง id ที่จะลบจาก URL

    if (!book_id) {
      return res.status(400).json({ error: "id is required" });
    }
    connection = await getDbConnection();

    const status = "SA001";

    const result = await connection.execute(
      "UPDATE Booking SET app_id = :app_id WHERE book_id = :book_id",
      { app_id: status, book_id }
    );

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    await connection.execute(
      `INSERT INTO  qrcode ( book_id, num ) VALUES ( :book_id, :num) `,
      {
        book_id: book_id,
        num: randomNumber,
      }
    );

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
