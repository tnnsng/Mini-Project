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

    // ดึงข้อมูลจากตาราง EMPLOYEE
    const result = await connection.execute(`
        SELECT R.ROOM_ID, 
               R.ROOM_NAME, 
               R.AMOUNT, 
               R.DETAIL,
               T.TYPE_ID, 
               T.TYPE_NAME,
               F.FLOOR_ID, 
               F.FLOOR_NAME,
               B.BUILD_ID, 
               B.BUILD_NAME, 
               ST.STROOM_NAME, 
               EMP.FNAME, EMP.LNAME
        FROM ROOM R
        JOIN TYPE T ON R.TYPE_ID = T.TYPE_ID
        JOIN STATUSROOM ST ON R.STROOM_ID = ST.STROOM_ID
        JOIN FLOOR F ON R.FLOOR_ID = F.FLOOR_ID
        JOIN BUILD B ON F.BUILD_ID = B.BUILD_ID
        JOIN EMPLOYEE EMP ON R.EMP_ID = EMP.EMP_ID
      `);

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

module.exports = router;
