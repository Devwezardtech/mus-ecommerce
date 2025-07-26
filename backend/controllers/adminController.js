const Order = require('../models/orderModel');

const getSalesStats = async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalPrice' },
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
          _id: { $isoWeek: '$createdAt' }, // Week number
          totalRevenue: { $sum: '$totalPrice' },
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
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.category',
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
      isPaid: true,
      paidAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Total today revenue
    const todayRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Breakdown: revenue per hour (24 slots)
    const breakdown = new Array(24).fill(0);
    orders.forEach((order) => {
      const hour = new Date(order.paidAt).getHours();
      breakdown[hour] += order.totalPrice;
    });

    res.json({ todayRevenue, breakdown });
  } catch (err) {
    console.error('Error in getTodayRevenueBreakdown:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSalesStats,
  getWeeklyStats,
  getCategoryStats,  getTodayRevenueBreakdown, };
