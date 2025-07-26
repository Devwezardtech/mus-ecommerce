const express = require('express');
const router = express.Router();
const { getSalesStats, getWeeklyStats, getCategoryStats, getTodayRevenueBreakdown } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/sales-stats', protect, isAdmin, getSalesStats);
router.get('/weekly-revenue', protect, isAdmin, getWeeklyStats);
router.get('/category-stats', protect, isAdmin, getCategoryStats);
router.get('/today-revenue-breakdown', protect, isAdmin, getTodayRevenueBreakdown);



module.exports = router;
