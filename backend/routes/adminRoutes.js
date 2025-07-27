const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Declare routes directly
router.get('/sales-stats', protect, isAdmin, adminController.SalesStats);
router.get('/weekly-revenue', protect, isAdmin, adminController.WeeklyStats);
router.get('/today-revenue-breakdown', protect, isAdmin, adminController.TodayRevenueBreakdown);

module.exports = router;
