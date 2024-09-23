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

router.post("/qrcode", async (req, res) => {
  let connection;
  try {
    const { book_id, num } = req.body;

    // Validate input data
    if (!book_id || !num) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("Received data:", req.body); // Debugging line

    connection = await getDbConnection();

    // Execute the query
    const result = await connection.execute(
      `INSERT INTO QRCODE (BOOK_ID, NUM) VALUES (:book_id, :num)`,
      {
        book_id: book_id,
        num: num,
      }
    );

    await connection.commit();

    // Respond with success
    res.status(201).json({ message: "successfully", bookID: book_id });
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
