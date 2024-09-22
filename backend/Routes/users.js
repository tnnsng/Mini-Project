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


router.get("/users", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง EMPLOYEE
    const result = await connection.execute("SELECT * FROM EMPLOYEE");

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

router.post("/user", async (req, res) => {
  let connection;
  try {
    const {
      emp_id,
      fname,
      lname,
      username,
      password,
      amount,
      status_id,
      posi_id,
      dep_id
    } = req.body;

    // Validate input data
    if (!emp_id || !fname || !lname || !username || !password || amount === undefined || !status_id || !posi_id || !dep_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // Execute the query
    const result = await connection.execute(
      `INSERT INTO employee (emp_id, fname, lname, username, password, amount, status_id, posi_id, dep_id)
      VALUES (:emp_id, :fname, :lname, :username, :password, :amount, :status_id, :posi_id, :dep_id)`,
      {emp_id, fname, lname, username, password, amount, status_id, posi_id, dep_id}
    );

    const affectedRows = result.affectedRows || 0; // Adjust according to your database library

    await connection.commit();

    // Respond with success
    res.status(201).json({ message: "User created successfully", userId: emp_id });
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

router.put("/user/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const {
      fname,
      lname,
      username,
      password,
      amount,
      status_id,
      posi_id,
      dep_id
    } = req.body;

    // Validate input data
    if ( !fname || !lname || !username || !password || amount === undefined || !status_id || !posi_id || !dep_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // Execute the update query
    const result = await connection.execute(
      `UPDATE employee SET 
        fname = :fname, 
        lname = :lname, 
        username = :username, 
        password = :password, 
        amount = :amount, 
        status_id = :status_id, 
        posi_id = :posi_id, 
        dep_id = :dep_id 
      WHERE emp_id = :emp_id`,
      {
        emp_id: id,
        fname,
        lname,
        username,
        password,
        amount,
        status_id,
        posi_id,
        dep_id,
      }
    );
    await connection.commit();
    // เข้าถึง affected rows ให้ถูกต้อง

    const affectedRows = result.rowsAffected;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // ส่งผลลัพธ์กลับ
    res.status(200).json({ message: "User updated successfully" });
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

router.delete("/user/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    connection = await getDbConnection();

    const result = await connection.execute(
      `DELETE FROM employee WHERE emp_id = :emp_id`,
      { emp_id: id }
    );
    
    await connection.commit();
    // Access rowsAffected directly from the result
    const affectedRows = result.rowsAffected;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
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
