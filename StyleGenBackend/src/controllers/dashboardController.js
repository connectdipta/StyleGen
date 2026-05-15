import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find({});

    const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const pendingOrders = orders.filter(o => (o.status?.toLowerCase() || 'pending') === 'pending').length;

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      totalCustomers,
      totalProducts,
      totalSales,
      pendingOrders,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
