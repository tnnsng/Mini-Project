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
router.get("/permission", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();
    // ดึงข้อมูลจากตาราง EMPLOYEE
    const result = await connection.execute("SELECT * FROM permission");
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

router.get("/perposition/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params; // ดึง id 
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    connection = await getDbConnection();

    const result = await connection.execute(
      "SELECT * FROM perposition WHERE POSI_ID = :id",
      { id }
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


router.post("/updatePermissions", async (req, res) => {
  let connection;
  try {
    const { posi_id, permissions } = req.body; // ใช้ posi_id แค่ตัวเดียว

    // ตรวจสอบว่า posi_id มีค่า
    if (!posi_id) {
      return res.status(400).json({ error: "'posi_id' is required." });
    }

    // สร้างการเชื่อมต่อ
    connection = await getDbConnection();

    // เริ่มต้น Transaction
    await connection.execute("SET TRANSACTION READ WRITE");

    // ลบสิทธิ์เก่าที่มี posi_id ตรง
    const deleteResult = await connection.execute(
      `DELETE FROM perposition WHERE posi_id = :posi_id`,
      [posi_id]
    );

    // ตรวจสอบว่ามีการลบแถวหรือไม่
    if (deleteResult.rowsAffected === 0) {
      console.log("No rows deleted. The posi_id may not exist.");
    }

    // แทรกสิทธิ์ใหม่
    for (const per_id of permissions) {
      const insertResult = await connection.execute(
        `INSERT INTO perposition (per_id, posi_id) VALUES (:per_id, :posi_id)`,
        [per_id, posi_id]
      );
      console.log("Rows inserted:", insertResult.rowsAffected);
    }

    // ยืนยัน Transaction
    await connection.commit();
    res.status(200).json({ message: "Permissions updated successfully." });
  } catch (err) {
    console.error("Error executing query", err);
    if (connection) {
      try {
        await connection.rollback(); // ย้อนกลับในกรณีเกิดข้อผิดพลาด
      } catch (rollbackErr) {
        console.error("Error rolling back", rollbackErr);
      }
    }
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close(); // ปิดการเชื่อมต่อ
      } catch (err) {
        console.error("Error closing connection", err);
      }
    }
  }
});




module.exports = router;
