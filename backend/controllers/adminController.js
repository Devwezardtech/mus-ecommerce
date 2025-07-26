const Order = require('../models/Order');

// 1. Total sales revenue
const getSalesStats = async (req, res) => {
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

    const totalRevenue = result[0]?.totalRevenue || 0;
    const totalOrders = result[0]?.totalOrders || 0;

    res.json({ totalRevenue, totalOrders });
  } catch (error) {
    console.error('getSalesStats error:', error);
    res.status(500).json({ message: 'Server Error: getSalesStats' });
  }
};

// 2. Weekly revenue
const getWeeklyStats = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6); // Last 7 days including today

    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days }, totalAmount: { $exists: true } } },
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
    console.error('getWeeklyStats error:', error);
    res.status(500).json({ message: 'Server Error: getWeeklyStats' });
  }
};

// 3. Category stats
const getCategoryStats = async (req, res) => {
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
    console.error('getCategoryStats error:', error);
    res.status(500).json({ message: 'Server Error: getCategoryStats' });
  }
};

// 4. Today’s revenue breakdown by hour
const getTodayRevenueBreakdown = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay }, totalAmount: { $exists: true } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Convert to readable format (hour labels)
    const formatted = result.map(item => ({
      hour: `${item._id}:00`,
      totalRevenue: item.totalRevenue,
      orderCount: item.orderCount
    }));

    res.json(formatted);
  } catch (error) {
    console.error('getTodayRevenueBreakdown error:', error);
    res.status(500).json({ message: 'Server Error: getTodayRevenueBreakdown' });
  }
};

module.exports = {
  getSalesStats,
  getWeeklyStats,
  getCategoryStats,
  getTodayRevenueBreakdown,
};
