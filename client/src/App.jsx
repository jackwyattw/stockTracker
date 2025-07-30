import { useState, useEffect } from 'react';
import './App.css';
import './TopStocks.css';
import './Top100Sidebar.css';
import Top100Sidebar from './Top100Sidebar';
import Top10International from './Top10International';


const API_KEY = 'd2059l9r01qmbi8r5u30d2059l9r01qmbi8r5u3g';

function App() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
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
      if (data.c && data.pc) {
        setPrice(data.c);
        setChange(data.c - data.pc);
        setError('');
      } else {
        setPrice(null);
        setChange(null);
        setError('Symbol not found');
      }
    } catch {
      setPrice(null);
      setChange(null);
      setError('Failed to fetch stock data');
    }
  };

  // Fetch top 10 S&P 500 stocks
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
          }
        } catch (err) {
          console.error(`Error fetching ${sym}:`, err);
        }
      }
      setTopStocks(results);
    }

    // Stagger fetch with slight delay to avoid rate limiting
    setTimeout(fetchTopStocks, 1000);
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
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchStockPrice();
            }}
            placeholder="Enter stock symbol (e.g., AAPL)"
          />
          <button onClick={fetchStockPrice}>Get Price</button>

          {price && change !== null && (
            <div className="search-result">
              <img
                src={`https://logo.clearbit.com/${symbol.toLowerCase()}.com`}
                alt={`${symbol} logo`}
                className="stock-logo"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <h2>
                {symbol.toUpperCase()}: ${parseFloat(price).toFixed(2)}{' '}
                <span className={`trend ${change >= 0 ? 'up' : 'down'}`}>
                  {change >= 0 ? '↑' : '↓'}
                </span>
              </h2>
            </div>
          )}
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
          <Top10International />
        </div>
      </div>
    </div>
  );
}

export default App;
