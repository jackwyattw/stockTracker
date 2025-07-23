// src/Top100Sidebar.jsx

import './Top100Sidebar.css';

const mockTop100 = [
  { symbol: 'AAPL', price: 215.43, change: 1.25 },
  { symbol: 'MSFT', price: 360.12, change: -0.45 },
  { symbol: 'NVDA', price: 950.87, change: 2.14 },
  // ... add more mock data or fetch from API
];

function Top100Sidebar() {
  return (
    <div className="sidebar">
      <h3>Top 100 S&P Stocks</h3>
      <ul>
        {mockTop100.map((stock) => (
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
