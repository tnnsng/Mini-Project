const express = require("express");
const router = express.Router();
const db = require("../Database/db");
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");

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

router.post("/login", async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    console.log(username);
    console.log(password);

    connection = await getDbConnection();

    // Update query with Oracle bind variable syntax
    const query = `SELECT employee.*, position.POSI_NAME 
                   FROM employee 
                   JOIN position ON employee.posi_id = position.posi_id 
                   WHERE employee.username = :username 
                   AND employee.password = :password`;

    // Execute the query
    const result = await connection.execute(query, { username, password });

    // Access the rows correctly depending on your driver
    const results = result.rows || result;
    //console.log(results);
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
    console.log(rows);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];
    const payload = {
      user: {
        emp_id: user.EMP_ID,
        fname: user.FNAME,
        lname: user.LNAME,
        posi_id: user.POSI_ID,
        posi_name: user.POSI_NAME,
      },
    };

    jwt.sign(payload, "jwtsecret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      return res
        .status(200)
        .json({ message: "Login successful", token, payload });
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
