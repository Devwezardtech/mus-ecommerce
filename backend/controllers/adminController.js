const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper: Central error handler
const handleError = (res, error, label) => {
  console.error(`[AdminController] ${label} error:`, error);
  res.status(500).json({ message: `Server Error during ${label}` });
};

// Total Sales Revenue and Order Count
const SalesStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { totalAmount: { $exists: true } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const data = stats[0] || { totalRevenue: 0, totalOrders: 0 };
    res.json(data);
  } catch (error) {
    handleError(res, error, 'SalesStats');
  }
};

// Weekly Revenue Breakdown (last 7 days)
const WeeklyStats = async (req, res) => {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 6);
    fromDate.setHours(0, 0, 0, 0); // normalize

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
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

    res.json(stats);
  } catch (error) {
    handleError(res, error, 'WeeklyStats');
  }
};

// Today's Hourly Revenue Breakdown
const TodayRevenueBreakdown = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
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

    const formatted = stats.map(entry => ({
      hour: `${entry._id}:00`,
      totalRevenue: entry.totalRevenue,
      orderCount: entry.orderCount
    }));

    res.json(formatted);
  } catch (error) {
    handleError(res, error, 'TodayRevenueBreakdown');
  }
};


const CategoryStats = async (req, res) => {
  try {
 const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get category stats' });
  }
};

module.exports = {
  SalesStats,
  WeeklyStats,
  TodayRevenueBreakdown,
  CategoryStats

};

