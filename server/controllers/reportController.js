const Trip = require('../models/Trip');

const getCategoryStats = async (req, res) => {
    try {
        const stats = await Trip.aggregate([
            { $match: { userId: req.user._id } },
            { $unwind: '$items' },
            { $group: {
                _id: '$items.category',
                totalAmount: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                itemCount: { $sum: 1 }
            }},
            { $sort: { totalAmount: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyStats = async (req, res) => {
    try {
        const stats = await Trip.aggregate([
            { $match: { userId: req.user._id } },
            { $group: {
                _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                totalSpent: { $sum: '$totalSpent' },
                tripCount: { $sum: 1 }
            }},
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const [summary] = await Trip.aggregate([
            { $match: { userId: req.user._id } },
            { $group: {
                _id: null,
                totalSpent: { $sum: '$totalSpent' },
                tripCount: { $sum: 1 },
                itemCount: { $sum: { $size: '$items' } }
            }}
        ]);
        res.json(summary || { totalSpent: 0, tripCount: 0, itemCount: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCategoryStats, getMonthlyStats, getSummary };
