const express = require("express");
const { connection } = require("./database/db");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.post("/api/store-number", async (req, res) => {
  const inputNumber = req.body.inputNumber;
  if (!inputNumber || inputNumber < 1 || inputNumber > 10) {
    return res.status(400).json({ error: "Invalid input number" });
  }

  connection.query(
    "INSERT INTO input_numbers (number) VALUES (?)",
    [inputNumber],
    (err, result) => {
      if (err) {
        console.error("Error inserting input number:", err);
        return res.status(500).json({ error: "Database error" });
      }

      for (let i = 1; i <= 10; i++) {
        const result = inputNumber ** i;
        console.log(result);

        connection.query(
          "INSERT INTO power (base, result) VALUES (?, ?)",
          [inputNumber, result],
          (err, result) => {
            if (err) {
              console.error("Error inserting power series:", err);
            }
          }
        );
      }

      res.status(200).json({
        message: "Input number and power series data stored successfully",
      });
    }
  );
});

app.get("/api/power-series", (req, res) => {
  connection.query(
    "SELECT base, result FROM power ORDER BY id DESC LIMIT 10",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error querying power series:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const powerSeriesData = rows.map((row) => ({
        base: row.base,
        result: row.result,
      }));

      powerSeriesData.reverse();

      res.json({ powerSeries: powerSeriesData });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
