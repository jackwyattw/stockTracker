import { useEffect, useState } from 'react';
import './Top100Sidebar.css';

const API_KEY = 'd2059l9r01qmbi8r5u30d2059l9r01qmbi8r5u3g';

const top100Symbols = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK.B', 'LLY', 'UNH',
  'JPM', 'AVGO', 'V', 'XOM', 'JNJ', 'WMT', 'MA', 'PG', 'HD', 'CVX',
  'MRK', 'COST', 'ABBV', 'PEP', 'BAC', 'ADBE', 'KO', 'CRM', 'TMO', 'NFLX',
  'PFE', 'ACN', 'ORCL', 'AMD', 'ABT', 'DIS', 'CSCO', 'MCD', 'DHR', 'LIN',
  'CMCSA', 'INTC', 'WFC', 'TXN', 'VZ', 'NKE', 'AMGN', 'NEE', 'UPS', 'PM',
  'LOW', 'MS', 'QCOM', 'CAT', 'UNP', 'HON', 'INTU', 'RTX', 'SPGI', 'PLD',
  'GS', 'BLK', 'BA', 'T', 'ISRG', 'AMAT', 'NOW', 'CVS', 'ZTS', 'DE',
  'SCHW', 'MDT', 'ADP', 'IBM', 'GE', 'TJX', 'LMT', 'ELV', 'GILD', 'SYK',
  'CI', 'MO', 'MMC', 'VRTX', 'REGN', 'ETN', 'PNC', 'FDX', 'MU', 'APD',
  'BDX', 'BSX', 'HUM', 'EW', 'FI', 'CB', 'CL', 'SO', 'ICE', 'CDNS'
];

function Top100Sidebar() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    let index = 0;
    const results = [];

    async function fetchOneAtATime() {
      if (index >= top100Symbols.length) return;

      const symbol = top100Symbols[index];
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        const data = await res.json();
        if (data.c && data.d != null) {
          results.push({ symbol, price: data.c, change: data.d });
          setStocks([...results]);
        }
      } catch (err) {
        console.error(`Error fetching ${symbol}`, err);
      }

      index++;
      setTimeout(fetchOneAtATime, 1100); // Wait 1.1s to stay under API limit
    }

    fetchOneAtATime();
  }, []);

  return (
    <div className="sidebar">
      <h3>Top 100 S&P Stocks</h3>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol}>
            {stock.symbol}{' '}
            <span className={stock.change >= 0 ? 'up' : 'down'}>
              {stock.change >= 0 ? '▲' : '▼'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Top100Sidebar;
