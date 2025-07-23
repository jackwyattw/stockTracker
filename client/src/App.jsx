import { useState, useEffect } from 'react';
import './App.css';
import './TopStocks.css';
import './Top100Sidebar.css';
import Top100Sidebar from './Top100Sidebar';


const API_KEY = 'd2059l9r01qmbi8r5u30d2059l9r01qmbi8r5u3g'; 

function App() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState('');
  const [topStocks, setTopStocks] = useState([]);

  const topCompanies = [
    'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN',
    'META', 'TSLA', 'BRK.B', 'UNH', 'LLY'
  ];

  const fetchStockPrice = async () => {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      const data = await res.json();
      if (data.c) {
        setPrice(data.c);
        setError('');
      } else {
        setPrice(null);
        setError('Symbol not found');
      }
    } catch {
      setPrice(null);
      setError('Failed to fetch stock data');
    }
  };

  useEffect(() => {
    async function fetchTopStocks() {
      const results = [];
      for (let sym of topCompanies) {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`);
          const data = await res.json();
          if (data.c && data.d != null) {
            results.push({
              symbol: sym,
              price: data.c,
              change: data.d,
              logo: `https://logo.clearbit.com/${sym.replace('.B', '')}.com`
            });
          } else {
            console.log(`Invalid quote for ${sym}`);
          }
        } catch (err) {
          console.error(`Error fetching ${sym}:`, err);
        }
      }
      setTopStocks(results);
    }

    fetchTopStocks();
  }, []);

  return (
    <div className="app-layout">
      <Top100Sidebar />
      <div className="container">
        <h1>Stock Tracker</h1>

        <div className="search-section">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
          />
          <button onClick={fetchStockPrice}>Get Price</button>
          {price && <h2>Current Price: ${parseFloat(price).toFixed(2)}</h2>}
          {error && <p className="error">{error}</p>}
        </div>

        <div className="top-stocks">
          <h2>Top 10 S&P 500 Stocks</h2>
          <ul>
            {topStocks.map((stock) => (
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
      </div>
    </div>
  );
}

export default App;