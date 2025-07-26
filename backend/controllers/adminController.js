const Order = require('../models/orderModel');

const getSalesStats = async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' }, // FIXED
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: 'Error generating stats' });
  }
};

const getWeeklyStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: { $isoWeek: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' }, // FIXED
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error getting weekly stats' });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: '$products' }, // FIXED
      {
        $group: {
          _id: '$products.category', // Requires `category` inside order products
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error getting category stats' });
  }
};

const getTodayRevenueBreakdown = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      paidAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const todayRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0); // FIXED

    const breakdown = new Array(24).fill(0);
    orders.forEach((order) => {
      const hour = new Date(order.paidAt).getHours();
      breakdown[hour] += order.totalAmount; // FIXED
    });

    res.json({ todayRevenue, breakdown });
  } catch (err) {
    console.error('Error in getTodayRevenueBreakdown:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSalesStats,
  getWeeklyStats,
  getCategoryStats,
  getTodayRevenueBreakdown,
};
