const express = require("express");
const router = express.Router();
const {
  SalesStats,
  WeeklyStats,
  TodayRevenueBreakdown,
} = require("../controllers/adminController"); // path match filename

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/sales-stats", protect, isAdmin, SalesStats);
router.get("/weekly-revenue", protect, isAdmin, WeeklyStats);
router.get("/today-revenue-breakdown", protect, isAdmin, TodayRevenueBreakdown);

module.exports = router;
