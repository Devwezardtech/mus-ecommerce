const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const { protect, isAdmin } = require('../middleware/authMiddleware');

//DEBUG: Log available keys from adminController
console.log('Available adminController keys:', Object.keys(adminController));

// Define route path and controller method name
const routes = [
  { path: '/sales-stats', method: 'SalesStats' },
  { path: '/weekly-revenue', method: 'WeeklyStats' },
  { path: '/category-stats', method: 'CategoryStats' },
  { path: '/today-revenue-breakdown', method: 'TodayRevenueBreakdown' }
];

// Register routes dynamically with safety check
routes.forEach(({ path, method }) => {
  const handler = adminController[method];

  if (typeof handler !== 'function') {
    console.error(`Route "${path}" skipped: Method "${method}" not found in adminController`);
    return; // Skip route if handler is missing
  }

  console.log(`Route registered: [GET] ${path} -> adminController.${method}`);
  router.get(path, protect, isAdmin, handler);
});

module.exports = router;
