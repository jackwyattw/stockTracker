import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_KEY = 'ARBKH2BUGQTOTNWY';

function App() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState('');

  const fetchStockPrice = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();
      const quote = data["Global Quote"];

      if (quote && quote["05. price"]) {
        setPrice(quote["05. price"]);
        setError('');
      } else {
        setPrice(null);
        setError('Symbol not found');
      }
    } catch (err) {
      setPrice(null);
      setError('Failed to fetch stock data');
    }
  };

  return (
    <div className="App">
      <h1>Stock Tracker</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol (e.g., AAPL)"
      />
      <button onClick={fetchStockPrice}>Get Price</button>

      {price && <h2>Current Price: ${parseFloat(price).toFixed(2)}</h2>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default App;
