const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Define route path and method name mappings
const routes = [
  { path: '/sales-stats', method: 'SalesStats' },
  { path: '/weekly-revenue', method: 'WeeklyStats' },
  { path: '/category-stats', method: 'CategoryStats' },
  { path: '/today-revenue-breakdown', method: 'TodayRevenueBreakdown' }
];

// Register routes dynamically
routes.forEach(route => {
  router.get(route.path, protect, isAdmin, adminController[route.method]);
});

module.exports = router;
