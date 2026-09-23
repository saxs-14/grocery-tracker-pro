const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
});

const registerUser = async (req, res) => {
    try {
        const name = String(req.body.name || '').trim();
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        if (!name || name.length > 80) return res.status(400).json({ message: 'Name is required and must be 80 characters or fewer.' });
        if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please provide a valid email address.' });
        if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(409).json({ message: 'An account with this email already exists.' });

        const user = await User.create({ name, email, password });
        res.status(201).json(publicUser(user));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');
        const user = await User.findOne({ email });

        if (user && await user.matchPassword(password)) {
            return res.json(publicUser(user));
        }
        res.status(401).json({ message: 'Invalid email or password.' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to sign in right now.' });
    }
};

const getMe = async (req, res) => {
    res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
};

module.exports = { registerUser, loginUser, getMe };
