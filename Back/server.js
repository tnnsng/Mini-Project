const oracledb = require("oracledb");

try {
  // กำหนด path ไปยังโฟลเดอร์ที่ติดตั้ง Oracle Instant Client
  oracledb.initOracleClient({ libDir: "C://instantclient_12_1" });
} catch (err) {
  console.error("Whoops! Error initializing Oracle Client:", err);
  process.exit(1);
}

// ข้อมูลการเชื่อมต่อฐานข้อมูล
const config = {
  user: "db671086", // ชื่อผู้ใช้งานในฐานข้อมูล
  password: "54064", // รหัสผ่าน
  connectString: "203.188.54.7:1521/database", // ข้อมูลการเชื่อมต่อ (host:port/SID หรือ service name)
};

async function run() {
  let connection;

  try {
    // สร้างการเชื่อมต่อ
    connection = await oracledb.getConnection(config);

    console.log("Connected to Oracle Database");

    // ตัวอย่างการรันคำสั่ง SQL
    const result = await connection.execute(
      `SELECT * FROM EMPLOYEE` // แทนด้วย SQL ที่ต้องการ
    );

    console.log(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // ปิดการเชื่อมต่อ
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();
