import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("LKR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [currentRate, setCurrentRate] = useState(null); // NEW

  // Fetch currencies only once
  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
      .then(res => res.json())
      .then(data => {
        const allCurrencies = Object.keys(data.rates);
        allCurrencies.sort((a, b) => (a === "LKR" ? -1 : b === "LKR" ? 1 : 0));
        setCurrencies(allCurrencies);
      });
  }, []);

  // Fetch current rate when fromCurrency or toCurrency changes
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
          setCurrentRate(data.rates[toCurrency]);
        });
    }
  }, [fromCurrency, toCurrency]);

  // Fetch conversion rate on submit
  const handleConvert = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await res.json();
      const rate = data.rates[toCurrency];
      const converted = (amount * rate).toFixed(2);
      setResult(converted);
    } catch (error) {
      console.error("Conversion failed:", error);
    }
  };

  return (
    <div className="container">
      <h2>Currency Converter 💱</h2>
      <form className="form" onSubmit={handleConvert}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <span style={{ fontWeight: "bold", alignSelf: "center" }}>to</span>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ display: "block", margin: "0 auto" }}>Convert</button>
      </form>
      {result && (
        <h3>{amount} {fromCurrency} = {result} {toCurrency}</h3>
      )}
      {currentRate && (
        <p style={{ marginTop: "16px" }}>
          1 {fromCurrency} equals {currentRate} {toCurrency} today
        </p>
      )}
      <footer>
        <p>© 2023 Currency Converter. All rights reserved.</p>
      </footer> 
    </div>
  );
}

export default App;
