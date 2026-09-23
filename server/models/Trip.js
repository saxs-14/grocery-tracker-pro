const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0.01, default: 1 },
    category: {
        type: String,
        enum: ['Food', 'Drinks', 'Toiletries', 'Household', 'Other'],
        default: 'Other'
    }
});

const TripSchema = new mongoose.Schema({
    storeName: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, default: Date.now },
    items: [ItemSchema],
    totalSpent: { type: Number, default: 0, min: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

TripSchema.pre('save', function () {
    this.totalSpent = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

module.exports = mongoose.model('Trip', TripSchema);
