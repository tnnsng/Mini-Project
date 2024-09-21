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

router.get("/build", async (req, res) => {
  let connection;
  try {
    connection = await getDbConnection();

    // ดึงข้อมูลจากตาราง
    const result = await connection.execute("SELECT * FROM BUILD");

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

router.post("/build", async (req, res) => {
  let connection;
  try {
    const { build_id, build_name } = req.body;
    // ตรวจสอบข้อมูลก่อนดำเนินการ
    if (!build_id || !build_name) {
      return res
        .status(400)
        .json({ error: "build_id and build_name are required" });
    }

    connection = await getDbConnection();

    const result = await connection.execute(
      `
        INSERT INTO build (build_id, build_name)
        VALUES (:build_id, :build_name)`,
      {
        build_id: build_id,
        build_name: build_name,
      }
    );

    // Commit การเปลี่ยนแปลง
    await connection.commit();

    // ส่งผลลัพธ์กลับ
    res.status(201).json({ message: "Build created successfully", result });
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

router.put("/build", async (req, res) => {
  let connection;
  try {
    const { build_id, build_name } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
    if (!build_id || !build_name) {
      return res
        .status(400)
        .json({ error: "build_id and build_name are required" });
    }

    connection = await getDbConnection();

    const result = await connection.execute(
      `
        UPDATE build
        SET build_name = :build_name
        WHERE build_id = :build_id`,
      {
        build_id: build_id,
        build_name: build_name,
      }
    );

    // ตรวจสอบว่ามีการอัปเดตแถวใด ๆ หรือไม่
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Build not found" });
    }

    // คอมมิตการเปลี่ยนแปลง
    await connection.commit();

    // ส่งผลลัพธ์กลับ
    res.status(200).json({ message: "Build updated successfully", result });
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

router.delete("/build/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params; // ดึง id ที่จะลบจาก URL

    if (!id) {
      return res.status(400).json({ error: "build_id is required" });
    }

    // เชื่อมต่อฐานข้อมูล
    connection = await getDbConnection();

    // ใช้ execute เพื่อลบข้อมูล
    const result = await connection.execute(
      `DELETE FROM build WHERE build_id = :build_id`,
      {
        build_id: id,
      }
    );

    // Commit การเปลี่ยนแปลง
    await connection.commit();

    // ตรวจสอบว่ามีแถวถูกลบหรือไม่
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Build not found" });
    }

    res.status(200).json({ message: "Build deleted successfully" });
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
