const Order = require('../models/Order');

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

    const totalRevenue = result[0]?.totalRevenue || 0;
    const totalOrders = result[0]?.totalOrders || 0;

    res.json({ totalRevenue, totalOrders });
  } catch (error) {
    console.error('SalesStats error:', error);
    res.status(500).json({ message: 'Server Error: SalesStats' });
  }
};

// 2. Weekly Revenue Breakdown
const WeeklyStats = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

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
    console.error('WeeklyStats error:', error);
    res.status(500).json({ message: 'Server Error: WeeklyStats' });
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
    console.error('CategoryStats error:', error);
    res.status(500).json({ message: 'Server Error: CategoryStats' });
  }
};

// 4. Today's Hourly Revenue Breakdown
const TodayRevenueBreakdown = async (req, res) => {
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

    const formatted = result.map(item => ({
      hour: `${item._id}:00`,
      totalRevenue: item.totalRevenue,
      orderCount: item.orderCount
    }));

    res.json(formatted);
  } catch (error) {
    console.error('TodayRevenueBreakdown error:', error);
    res.status(500).json({ message: 'Server Error: TodayRevenueBreakdown' });
  }
};

module.exports = {
  SalesStats,
  WeeklyStats,
  CategoryStats,
  TodayRevenueBreakdown,
};
