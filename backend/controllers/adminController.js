const Order = require('../models/Order');

// Helper for error response
const handleError = (res, error, label) => {
  console.error(`${label} error:`, error);
  res.status(500).json({ message: `Server Error: ${label}` });
};

// 1. Total Sales Revenue and Order Count
const SalesStats = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { totalAmount: { $exists: true } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const { totalRevenue = 0, totalOrders = 0 } = result[0] || {};
    res.json({ totalRevenue, totalOrders });
  } catch (error) {
    handleError(res, error, 'SalesStats');
  }
};

// 2. Weekly Revenue Breakdown (last 7 days)
const WeeklyStats = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          totalAmount: { $exists: true }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    handleError(res, error, 'WeeklyStats');
  }
};

// 3. Sales per Category
const CategoryStats = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { "orderItems.0": { $exists: true } } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.category",
          totalSales: { $sum: "$orderItems.price" },
          totalQuantity: { $sum: "$orderItems.quantity" }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json(result);
  } catch (error) {
    handleError(res, error, 'CategoryStats');
  }
};

// 4. Today's Hourly Revenue Breakdown
const TodayRevenueBreakdown = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay },
          totalAmount: { $exists: true }
        }
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = result.map(item => ({
      hour: `${item._id}:00`,
      totalRevenue: item.totalRevenue,
      orderCount: item.orderCount
    }));

    res.json(formatted);
  } catch (error) {
    handleError(res, error, 'TodayRevenueBreakdown');
  }
};

module.exports = {
  SalesStats,
  WeeklyStats,
  CategoryStats,
  TodayRevenueBreakdown,
};
