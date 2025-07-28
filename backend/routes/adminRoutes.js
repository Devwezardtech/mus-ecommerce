const express = require("express");
const router = express.Router();

const { SalesStats, WeeklyStats, TodayRevenueBreakdown, CategoryStats } = require("../controllers/adminController");

router.get("/sales-stats", SalesStats);
router.get("/weekly-revenue", WeeklyStats);
router.get("/today-revenue-breakdown", TodayRevenueBreakdown);
router.get("/category-stats", CategoryStats);

module.exports = router;
