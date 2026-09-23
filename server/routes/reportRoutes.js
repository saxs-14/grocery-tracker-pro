const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCategoryStats, getMonthlyStats, getSummary } = require('../controllers/reportController');

router.use(protect);
router.get('/category-stats', getCategoryStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/summary', getSummary);

module.exports = router;
