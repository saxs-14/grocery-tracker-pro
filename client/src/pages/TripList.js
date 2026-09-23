import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, createTrip, deleteTrip } from '../services/api';
import { Trash2, Eye, Plus } from 'lucide-react';

const money = (value) => `R ${Number(value || 0).toFixed(2)}`;

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try { setError(''); const { data } = await getTrips(); setTrips(data); }
    catch (err) { setError(err.response?.data?.message || 'Could not load your trips.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    try {
      await createTrip({ storeName: storeName.trim(), date });
      setStoreName('');
      fetchTrips();
    } catch (err) { setError(err.response?.data?.message || 'Could not create trip.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this grocery trip and all its items?')) return;
    try { await deleteTrip(id); fetchTrips(); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete trip.'); }
  };

  return (
    <section>
      <div className="hero">
        <div><span className="eyebrow">PERSONAL GROCERY CONTROL</span><h1>Your grocery trips</h1><p>Record what you buy and see exactly what each trip costs.</p></div>
      </div>
      <form className="card create-form" onSubmit={handleCreateTrip}>
        <div className="form-grow"><label>Store</label><input maxLength="120" placeholder="e.g. Shoprite, Checkers, Pick n Pay" value={storeName} onChange={e => setStoreName(e.target.value)} required /></div>
        <div><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
        <button className="primary-button" type="submit"><Plus size={18}/> New trip</button>
      </form>
      {error && <div className="error page-message">{error}</div>}
      {loading ? <div className="empty">Loading your trips…</div> : trips.length === 0 ? <div className="empty card"><h3>No trips yet</h3><p>Create your first grocery trip above.</p></div> : (
        <div className="trip-grid">{trips.map(trip => (
          <article className="card trip-card" key={trip._id}>
            <div><span className="date">{new Date(trip.date).toLocaleDateString('en-ZA')}</span><h3>{trip.storeName}</h3><p>{trip.items.length} item{trip.items.length === 1 ? '' : 's'}</p></div>
            <div className="trip-actions"><strong>{money(trip.totalSpent)}</strong><Link className="icon-button" title="Open trip" to={`/trip/${trip._id}`}><Eye size={19}/></Link><button className="icon-button danger" title="Delete trip" onClick={() => handleDelete(trip._id)}><Trash2 size={19}/></button></div>
          </article>
        ))}</div>
      )}
    </section>
  );
};
export default TripList;
