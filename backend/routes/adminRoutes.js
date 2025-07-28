const express = require("express");
const router = express.Router();

const { SalesStats, WeeklyStats, TodayRevenueBreakdown, getCategoryStats } = require("../controllers/adminController");

router.get("/sales-stats", protect, isAdmin, SalesStats);
router.get("/weekly-revenue", protect, isAdmin, WeeklyStats);
router.get("/today-revenue-breakdown", protect, isAdmin, TodayRevenueBreakdown);
router.get("/category-stats", protect, isAdmin, getCategoryStats);

module.exports = router;
