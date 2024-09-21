const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const { readdirSync } = require("fs");

const PORT = 5000;
const db = require("./Database/db");

try {
  // กำหนด path ไปยังโฟลเดอร์ที่ติดตั้ง Oracle Instant Client
  oracledb.initOracleClient({ libDir: "C:/instantclient_12_1" });
} catch (err) {
  console.error("Whoops! Error initializing Oracle Client:", err);
  process.exit(1);
}
// Middleware
app.use(cors());
app.use(express.json());

// Function to get a database connection

readdirSync("./Routes").map((r) => app.use("/", require("./Routes/" + r)));

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
