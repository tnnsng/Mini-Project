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
    const result = await connection.execute(
      `SELECT E.*, 
              SE.STATUS_NAME, 
              P.POSI_NAME, 
              D.DEP_NAME
      FROM EMPLOYEE E
      JOIN STATUSEMP SE ON SE.STATUS_ID = E.STATUS_ID
      JOIN POSITION P ON P.POSI_ID = E.POSI_ID
      JOIN DEPARTMENT D ON D.DEP_ID = E.DEP_ID`
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

router.get("/users/:empID", async (req, res) => {
  const empID = req.params.empID; // Get empID from the request parameters
  let connection;
  try {
    connection = await getDbConnection();

    // Query to fetch user data by empID
    const result = await connection.execute(
      `SELECT E.*, 
              SE.STATUS_NAME, 
              P.POSI_NAME, 
              D.DEP_NAME
      FROM EMPLOYEE E
      JOIN STATUSEMP SE ON SE.STATUS_ID = E.STATUS_ID
      JOIN POSITION P ON P.POSI_ID = E.POSI_ID
      JOIN DEPARTMENT D ON D.DEP_ID = E.DEP_ID
      WHERE E.EMP_ID = :empID`, // Use a parameterized query to prevent SQL injection
      [empID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" }); // Handle case where user does not exist
    }

    // Convert row data to JSON
    const user = result.rows[0]; // Assuming only one user will be returned
    const headers = result.metaData.map((col) => col.name);
    let userData = {};
    user.forEach((cell, index) => {
      userData[headers[index]] = cell;
    });

    // Send user data as JSON
    res.json(userData);
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
      fname,
      lname,
      username,
      password,
      amount,
      status_id,
      posi_id,
      dep_id,
    } = req.body;

    connection = await getDbConnection();

    const result_emp = await connection.execute(
      `SELECT EMP_ID FROM (SELECT EMP_ID FROM EMPLOYEE ORDER BY EMP_ID DESC) WHERE ROWNUM = 1`
    );

    let rows = result_emp.rows;
    let newEmployeeID = "E0001"; // ค่าปริยายถ้าไม่มีผู้ใช้ในฐานข้อมูล

    if (rows.length > 0) {
      const lastEmployeeID = rows[0][0]; // ดึง BOOK_ID จากแถวแรก
      const lastNumber = parseInt(lastEmployeeID.substring(1), 10);
      const newNumber = lastNumber + 1;
      newEmployeeID = `E${newNumber.toString().padStart(4, "0")}`;
    }

    // Validate input data
    if (
      !newEmployeeID ||
      !fname ||
      !lname ||
      !username ||
      !password ||
      amount === undefined ||
      !status_id ||
      !posi_id ||
      !dep_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getDbConnection();

    // Execute the query
    const result = await connection.execute(
      `INSERT INTO employee (emp_id, fname, lname, username, password, amount, status_id, posi_id, dep_id)
      VALUES (:emp_id, :fname, :lname, :username, :password, :amount, :status_id, :posi_id, :dep_id)`,
      {
        emp_id: newEmployeeID,
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

    const affectedRows = result.affectedRows || 0; // Adjust according to your database library

    await connection.commit();

    // Respond with success
    res
      .status(201)
      .json({ message: "User created successfully", userId: newEmployeeID });
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
      dep_id,
    } = req.body;

    // Validate input data
    if (
      !fname ||
      !lname ||
      !username ||
      !password ||
      amount === undefined ||
      !status_id ||
      !posi_id ||
      !dep_id
    ) {
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
