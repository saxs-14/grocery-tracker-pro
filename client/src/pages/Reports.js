import React, { useEffect, useState } from 'react';
import { BarChart3, Receipt, ShoppingBasket } from 'lucide-react';
import { getCategoryStats, getSummary } from '../services/api';

const money = (v) => `R ${Number(v || 0).toFixed(2)}`;

const Reports = () => {
  const [stats, setStats] = useState([]);
  const [summary, setSummary] = useState({ totalSpent:0, tripCount:0, itemCount:0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCategoryStats(), getSummary()])
      .then(([category, totals]) => { setStats(category.data); setSummary(totals.data); })
      .catch(err => setError(err.response?.data?.message || 'Could not load reports.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty">Preparing your spending report…</div>;
  const grandTotal = Number(summary.totalSpent || 0);

  return <section>
    <div className="hero"><div><span className="eyebrow">YOUR MONEY, YOUR DATA</span><h1>Spending reports</h1><p>Understand your grocery spending without losing track of the basics.</p></div><BarChart3 size={42}/></div>
    {error && <div className="error page-message">{error}</div>}
    <div className="stats-grid">
      <div className="card stat"><Receipt/><span>Total spent</span><strong>{money(grandTotal)}</strong></div>
      <div className="card stat"><ShoppingBasket/><span>Trips</span><strong>{summary.tripCount}</strong></div>
      <div className="card stat"><ShoppingBasket/><span>Items</span><strong>{summary.itemCount}</strong></div>
    </div>
    <div className="card report-card"><h2>By category</h2>{stats.length === 0 ? <p className="muted">No purchases recorded yet.</p> : stats.map(stat => {
      const percent = grandTotal > 0 ? (Number(stat.totalAmount) / grandTotal) * 100 : 0;
      return <div className="report-row" key={stat._id}><div className="report-label"><span>{stat._id}</span><strong>{money(stat.totalAmount)}</strong></div><div className="progress"><div style={{width:`${percent}%`}}/></div><small>{stat.itemCount} line item{stat.itemCount === 1 ? '' : 's'} · {percent.toFixed(1)}%</small></div>;
    })}</div>
  </section>;
};
export default Reports;
