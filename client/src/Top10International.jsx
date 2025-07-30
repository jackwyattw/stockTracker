// Top10International.jsx
import React, { useEffect, useState } from 'react';
import './TopStocks.css'; // Reuse styling or create your own

const API_KEY = 'your_finnhub_api_key';

const internationalSymbols = ['TM', 'NSANY', 'BABA', 'TCEHY', 'VWAGY', 'SAP', 'BP', 'RY', 'HSBC', 'AZN'];

function Top10International() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      const results = [];

      for (let sym of internationalSymbols) {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`);
          const data = await res.json();
          if (data.c && data.d != null) {
            results.push({
              symbol: sym,
              price: data.c,
              change: data.d,
              logo: `https://logo.clearbit.com/${sym.toLowerCase()}.com`,
            });
          }
        } catch (err) {
          console.error(`Error fetching ${sym}`, err);
        }
      }

      setStocks(results);
    };

    fetchStocks();
  }, []);

  return (
    <div className="top-stocks">
      <h2>Top 10 International Stocks</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol} className="stock-item">
            <img
              src={stock.logo}
              alt={`${stock.symbol} logo`}
              className="stock-logo"
              onError={(e) => (e.target.style.display = 'none')}
            />
            <strong>{stock.symbol}</strong>: ${parseFloat(stock.price).toFixed(2)}
            <span className={`trend ${stock.change >= 0 ? 'up' : 'down'}`}>
              {stock.change >= 0 ? '↑' : '↓'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Top10International;

