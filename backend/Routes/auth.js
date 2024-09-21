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

    // ตรวจสอบข้อมูลก่อนดำเนินการ
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    console.log(username);
    console.log(password);
    connection = await getDbConnection();

    // ตรวจสอบข้อมูลผู้ใช้ในฐานข้อมูล
    const query = `SELECT employee.*, position.POSI_NAME 
                   FROM employee 
                   JOIN position ON employee.posi_id = position.posi_id 
                   WHERE employee.username = ? 
                   AND employee.password = ?`;
    const [results] = await connection.execute(query, [username, password]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = results[0];
    const payload = {
      user: {
        fname: user.fname,
        lname: user.lname,
        posi_id: user.posi_id,
        posi_name: user.posi_name,
      },
    };
    jwt.sign(payload, "jwtsecret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      // ถ้าผู้ใช้ล็อกอินสำเร็จ
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
