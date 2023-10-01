import React, { useState, useEffect } from "react";
import axios from "axios";

const InputForm = () => {
  const [inputNumber, setInputNumber] = useState("");
  const [powerSeries, setPowerSeries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/power-series").then((response) => {
      setPowerSeries(response.data.powerSeries);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputNumber
    const parsedInput = parseInt(inputNumber);
    if (isNaN(parsedInput) || parsedInput < 1 || parsedInput > 10) {
      setError("Enter a valid number between 1 and 10.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/store-number",
        {
          inputNumber: parsedInput,
        }
      );
      setPowerSeries(response.data.powerSeries);
      setError("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a number between 1 and 10:
          <input
            type="number"
            min="1"
            max="10"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
          />
        </label>
        <button type="submit">Calculate Power Series</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h2>Power Series:</h2>
        <ul>
          {powerSeries ? (
            powerSeries.map((data, index) => (
              <li key={index}>
                {data.base}^{index + 1} = {data.result}
              </li>
            ))
          ) : (
            <li>Refresh the page</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default InputForm;
