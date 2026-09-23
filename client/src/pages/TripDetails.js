import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { getTrip, addItem, updateItem, deleteItem } from '../services/api';

const money = (value) => `R ${Number(value || 0).toFixed(2)}`;
const empty = { name: '', price: '', quantity: 1, category: 'Food' };

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [formData, setFormData] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(empty);
  const [error, setError] = useState('');

  const loadTrip = async () => {
    try { const { data } = await getTrip(id); setTrip(data); }
    catch (err) { setError(err.response?.data?.message || 'Could not load this trip.'); }
  };
  useEffect(() => { loadTrip(); }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try { await addItem(id, { ...formData, price: Number(formData.price), quantity: Number(formData.quantity) }); setFormData(empty); loadTrip(); }
    catch (err) { setError(err.response?.data?.message || 'Could not add item.'); }
  };

  const handleUpdate = async (e, itemId) => {
    e.preventDefault();
    try { await updateItem(id, itemId, { ...editForm, price: Number(editForm.price), quantity: Number(editForm.quantity) }); setEditing(null); loadTrip(); }
    catch (err) { setError(err.response?.data?.message || 'Could not update item.'); }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Remove this item?')) return;
    try { await deleteItem(id, itemId); loadTrip(); }
    catch (err) { setError(err.response?.data?.message || 'Could not remove item.'); }
  };

  if (!trip) return <div className="empty">{error || 'Loading trip…'}</div>;

  return <section>
    <button className="back-button" onClick={() => navigate('/')}><ArrowLeft size={17}/> Trips</button>
    <div className="trip-header"><div><span className="date">{new Date(trip.date).toLocaleDateString('en-ZA')}</span><h1>{trip.storeName}</h1></div><div className="total-box"><span>Trip total</span><strong>{money(trip.totalSpent)}</strong></div></div>
    {error && <div className="error page-message">{error}</div>}
    <form className="card item-form" onSubmit={handleAdd}>
      <input maxLength="120" placeholder="Item name" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} required />
      <input min="0" step="0.01" type="number" placeholder="Price (R)" value={formData.price} onChange={e => setFormData({...formData, price:e.target.value})} required />
      <input min="0.01" step="0.01" type="number" placeholder="Qty" value={formData.quantity} onChange={e => setFormData({...formData, quantity:e.target.value})} required />
      <select value={formData.category} onChange={e => setFormData({...formData, category:e.target.value})}><option>Food</option><option>Drinks</option><option>Toiletries</option><option>Household</option><option>Other</option></select>
      <button className="primary-button" type="submit"><Plus size={18}/> Add</button>
    </form>
    <div className="card table-card"><div className="table-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead><tbody>
      {trip.items.map(item => editing === item._id ? (
        <tr key={item._id}><td colSpan="6"><form className="edit-row" onSubmit={e => handleUpdate(e,item._id)}><input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} required/><input type="number" min="0" step="0.01" value={editForm.price} onChange={e=>setEditForm({...editForm,price:e.target.value})} required/><input type="number" min="0.01" step="0.01" value={editForm.quantity} onChange={e=>setEditForm({...editForm,quantity:e.target.value})} required/><select value={editForm.category} onChange={e=>setEditForm({...editForm,category:e.target.value})}><option>Food</option><option>Drinks</option><option>Toiletries</option><option>Household</option><option>Other</option></select><button className="icon-button"><Check/></button><button type="button" className="icon-button" onClick={()=>setEditing(null)}><X/></button></form></td></tr>
      ) : <tr key={item._id}><td><strong>{item.name}</strong></td><td>{item.category}</td><td>{money(item.price)}</td><td>{item.quantity}</td><td><strong>{money(item.price * item.quantity)}</strong></td><td><button className="icon-button" title="Edit" onClick={()=>{setEditing(item._id);setEditForm({...item})}}><Pencil size={17}/></button><button className="icon-button danger" title="Remove" onClick={()=>handleDelete(item._id)}><Trash2 size={17}/></button></td></tr>
      )}
    </tbody></table></div></div>
  </section>;
};
export default TripDetails;
