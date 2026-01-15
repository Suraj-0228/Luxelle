const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, billingAddress, paymentMethod } = req.body;

    // Recalculate the total amount on the server-side to prevent client-side manipulation
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product with id ${item.product} not found` });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      user,
      items,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentStatus: 'Paid', // Mocking payment status
      orderStatus: 'Confirmed',
    });

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all orders for a user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.product');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Add logic here to check if the order can be cancelled
    // For example, an order can only be cancelled if it is in 'Confirmed' or 'Processing' state
    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped') {
      return res.status(400).json({ success: false, error: 'Cannot cancel an order that has been shipped or delivered' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'fullname email').populate('items.product');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.orderStatus = req.body.orderStatus;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
