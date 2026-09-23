import React, { useState } from 'react';
import { login, register } from '../services/api';

const Auth = ({ onAuthenticated }) => {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            const { data } = mode === 'login' ? await login(form) : await register(form);
            localStorage.setItem('grocery_tracker_user', JSON.stringify(data));
            onAuthenticated(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="auth-shell">
            <section className="auth-card">
                <div className="brand-mark">🛒</div>
                <h1>Grocery Tracker Pro</h1>
                <p className="muted">Track every grocery trip, keep your budget visible, and understand where your money goes.</p>
                <form onSubmit={submit} className="stack">
                    {mode === 'register' && (
                        <label>Name<input required maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
                    )}
                    <label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
                    <label>Password<input required minLength="8" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
                    {error && <div className="error">{error}</div>}
                    <button className="primary-button" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
                </form>
                <button className="link-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
                    {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
                </button>
            </section>
        </main>
    );
};

export default Auth;
