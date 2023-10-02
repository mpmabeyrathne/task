const mysql = require("mysql2");

//create database connection
exports.connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "112233",
  database: "power_series",
});
