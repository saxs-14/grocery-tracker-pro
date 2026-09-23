const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const tripRoutes = require('./routes/tripRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map(v => v.trim()) : true
}));
app.use(express.json({ limit: '100kb' }));

app.use('/api/trips', tripRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'grocery-tracker-api', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => res.json({ message: 'Grocery Tracker API is running.' }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
});

if (require.main === module) {
    connectDB().then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}

module.exports = app;
