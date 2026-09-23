const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const validCategories = ['Food', 'Drinks', 'Toiletries', 'Household', 'Other'];

const cleanItem = (body) => {
    const name = String(body.name || '').trim();
    const price = Number(body.price);
    const quantity = Number(body.quantity);
    const category = body.category || 'Other';

    if (!name || name.length > 120) throw new Error('Item name is required and must be 120 characters or fewer.');
    if (!Number.isFinite(price) || price < 0) throw new Error('Price must be a non-negative number.');
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Quantity must be greater than zero.');
    if (!validCategories.includes(category)) throw new Error('Invalid category.');

    return { name, price, quantity, category };
};

const createTrip = async (req, res) => {
    try {
        const storeName = String(req.body.storeName || '').trim();
        if (!storeName || storeName.length > 120) return res.status(400).json({ message: 'Store name is required and must be 120 characters or fewer.' });

        const date = req.body.date ? new Date(req.body.date) : new Date();
        if (Number.isNaN(date.getTime())) return res.status(400).json({ message: 'Invalid date.' });

        const trip = await Trip.create({ storeName, date, items: [], userId: req.user._id });
        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTrip = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid trip ID.' });
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTrip = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid trip ID.' });
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });
        res.json({ message: 'Trip deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addItemToTrip = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid trip ID.' });
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });

        trip.items.push(cleanItem(req.body));
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateItemInTrip = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid trip ID.' });
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });

        const item = trip.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found.' });

        Object.assign(item, cleanItem(req.body));
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteItemFromTrip = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid trip ID.' });
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });

        const item = trip.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found.' });
        item.deleteOne();

        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTrip, getTrips, getTrip, deleteTrip,
    addItemToTrip, updateItemInTrip, deleteItemFromTrip
};
