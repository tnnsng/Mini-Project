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
              r.type_id,
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

router.post("/room", async (req, res) => {
  let connection;
  try {
    const {
      room_id,
      room_name,
      amount,
      detail,
      build_id,
      floor_id,
      type_id,
      stroom_id,
      emp_id,
    } = req.body;

    // Validate input data
    if (
      !room_id ||
      !room_name ||
      !amount ||
      !build_id ||
      !floor_id ||
      !type_id ||
      !stroom_id ||
      !emp_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // Execute the query
    const result = await connection.execute(
      `INSERT INTO room (room_id, room_name, amount, detail, build_id, floor_id, type_id, stroom_id, emp_id)
      VALUES (:room_id, :room_name, :amount, :detail, :build_id, :floor_id, :type_id, :stroom_id, :emp_id)`,
      {
        room_id,
        room_name,
        amount,
        detail,
        build_id,
        floor_id,
        type_id,
        stroom_id,
        emp_id,
      }
    );

    // If result is not an array, access affectedRows or insertId directly
    const affectedRows = result.affectedRows || 0; // Adjust according to your database library

    await connection.commit();

    // Respond with success
    res.status(201).json({ message: "Room created successfully", roomId: room_id });
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

router.put("/room/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const {
      room_name,
      amount,
      detail,
      build_id,
      floor_id,
      type_id,
      stroom_id,
      emp_id,
    } = req.body;

    if (
      !room_name ||
      !amount ||
      !build_id ||
      !floor_id ||
      !type_id ||
      !stroom_id ||
      !emp_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // Execute the update query
    const result = await connection.execute(
      `UPDATE room SET 
        room_name = :room_name, 
        amount = :amount, 
        detail = :detail, 
        build_id = :build_id, 
        floor_id = :floor_id, 
        type_id = :type_id, 
        stroom_id = :stroom_id, 
        emp_id = :emp_id 
      WHERE room_id = :room_id`,
      {
        room_id: id,
        room_name,
        amount,
        detail,
        build_id,
        floor_id,
        type_id,
        stroom_id,
        emp_id,
      }
    );
    await connection.commit();
    // เข้าถึง affected rows ให้ถูกต้อง

    const affectedRows = result.rowsAffected;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    // ส่งผลลัพธ์กลับ
    res.status(200).json({ message: "Room updated successfully" });
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

router.delete("/room/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    connection = await getDbConnection();

    const result = await connection.execute(
      `DELETE FROM room WHERE room_id = :room_id`,
      { room_id: id }
    );
    
    await connection.commit();
    // Access rowsAffected directly from the result
    const affectedRows = result.rowsAffected;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
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
