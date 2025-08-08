"use client";
import { useEffect, useState } from "react";
import yahooFinance from "yahoo-finance2";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Home() {
  const [holdings, setHoldings] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("holdings")) || [];
    }
    return [];
  });
  const [prices, setPrices] = useState({});
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    localStorage.setItem("holdings", JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    async function fetchPrices() {
      if (holdings.length === 0) return;
      const uniqueTickers = [...new Set(holdings.map(h => h.ticker))];
      let newPrices = {};
      for (let t of uniqueTickers) {
        try {
          const result = await yahooFinance.quote(t);
          newPrices[t] = result.regularMarketPrice;
        } catch (e) {
          console.error("Error fetching", t, e);
        }
      }
      setPrices(newPrices);
    }
    fetchPrices();
  }, [holdings]);

  const totalValue = holdings.reduce((sum, h) => sum + (prices[h.ticker] || 0) * h.shares, 0);
  const gainLoss = holdings.reduce((sum, h) => {
    const val = (prices[h.ticker] || 0) * h.shares;
    const costVal = h.shares * h.cost;
    return sum + (val - costVal);
  }, 0);

  const COLORS = ["#00d4d4", "#00f5ff", "#9c4dff", "#ff6b6b", "#feca57"];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">💹 Investment Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Total Value</p>
          <h2 className="text-2xl font-bold">${totalValue.toFixed(2)}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Gain/Loss</p>
          <h2 className={`text-2xl font-bold ${gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${gainLoss.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* Add Holding */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl mb-2">Add Holding</h2>
        <input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="Ticker" className="p-2 text-black mr-2"/>
        <input value={shares} onChange={(e) => setShares(parseFloat(e.target.value))} placeholder="Shares" type="number" className="p-2 text-black mr-2"/>
        <input value={cost} onChange={(e) => setCost(parseFloat(e.target.value))} placeholder="Cost Basis" type="number" className="p-2 text-black mr-2"/>
        <button onClick={() => {setHoldings([...holdings, { ticker, shares, cost }]); setTicker(""); setShares(""); setCost("");}} className="bg-accentTeal px-4 py-2 rounded text-black">Add</button>
      </div>

      {/* Allocation Chart */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6" style={{ height: 300 }}>
        <h2 className="text-xl mb-2">Allocation</h2>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={holdings.map(h => ({ name: h.ticker, value: (prices[h.ticker] || 0) * h.shares }))} dataKey="value" outerRadius={100} label>
              {holdings.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings Table */}
      <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-3">Ticker</th>
            <th>Shares</th>
            <th>Cost Basis</th>
            <th>Price</th>
            <th>Value</th>
            <th>Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, i) => {
            const price = prices[h.ticker] || 0;
            const val = price * h.shares;
            const gl = val - (h.cost * h.shares);
            return (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-3">{h.ticker}</td>
                <td>{h.shares}</td>
                <td>${h.cost}</td>
                <td>${price.toFixed(2)}</td>
                <td>${val.toFixed(2)}</td>
                <td className={gl >= 0 ? "text-green-400" : "text-red-400"}>${gl.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
