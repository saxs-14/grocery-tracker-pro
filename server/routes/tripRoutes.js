const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createTrip, getTrips, getTrip, deleteTrip,
    addItemToTrip, updateItemInTrip, deleteItemFromTrip
} = require('../controllers/tripController');

router.use(protect);
router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTrip).delete(deleteTrip);
router.route('/:id/items').post(addItemToTrip);
router.route('/:id/items/:itemId').put(updateItemInTrip).delete(deleteItemFromTrip);

module.exports = router;
