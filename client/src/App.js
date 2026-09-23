import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import TripList from './pages/TripList';
import TripDetails from './pages/TripDetails';
import Reports from './pages/Reports';
import Auth from './pages/Auth';
import { getMe } from './services/api';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('grocery_tracker_user') || 'null'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const expired = () => { setUser(null); navigate('/login'); };
    window.addEventListener('auth-expired', expired);
    if (user?.token) getMe().catch(() => expired());
    return () => window.removeEventListener('auth-expired', expired);
  }, []);

  if (!user) return <Routes><Route path="*" element={<Auth onAuthenticated={(next) => { setUser(next); navigate('/'); }} />} /></Routes>;

  const logout = () => {
    localStorage.removeItem('grocery_tracker_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">🛒 GroceryPro</Link>
        <nav>
          <Link className={location.pathname === '/' ? 'active' : ''} to="/">Trips</Link>
          <Link className={location.pathname.startsWith('/reports') ? 'active' : ''} to="/reports">Reports</Link>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </nav>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<TripList />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<TripList />} />
        </Routes>
      </main>
      <footer className="footer">Signed in as {user.name} · Your data is private to your account.</footer>
    </div>
  );
}

export default App;
