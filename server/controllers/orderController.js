const Order = require('../models/Order');
const Product = require('../models/Product');
const Tax = require('../models/Tax');

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

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for product ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
    }

    // Tax Calculations (Dynamic from DB)
    const taxes = await Tax.find({});
    let gstRate = 0.18; // default 18% GST
    let importDutyRate = 0.05; // default 5%
    let processingFeeAmount = 150; // default 150

    const gstTaxObj = taxes.find(t => t.code === 'gst');
    const importDutyObj = taxes.find(t => t.code === 'import_duty');
    const processingFeeObj = taxes.find(t => t.code === 'processing_fee');

    if (gstTaxObj) gstRate = gstTaxObj.rate;
    if (importDutyObj) importDutyRate = importDutyObj.rate;
    if (processingFeeObj) processingFeeAmount = processingFeeObj.rate;

    const subtotal = totalAmount;
    const gstTax = subtotal * gstRate;
    const importDuty = subtotal * importDutyRate;
    const processingFee = subtotal > 0 ? processingFeeAmount : 0;
    const tax = gstTax + importDuty;

    const grandTotal = subtotal + tax + processingFee;

    const order = new Order({
      user,
      items,
      totalAmount: grandTotal,
      subtotal: subtotal,
      tax: tax,
      shippingCost: processingFee,
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
    const orders = await Order.find({ user: req.params.userId }).populate('user', 'fullname email').populate('items.product');
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

    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, error: 'Cannot cancel this order' });
    }

    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
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

    // Validation: Admin cannot set status to Cancelled
    if (req.body.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, error: 'Admin cannot cancel orders' });
    }

    // Validation: If order is already cancelled, status cannot be changed
    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, error: 'Cannot change the status of a cancelled order' });
    }

    // Validation: If order is already delivered, status cannot be changed
    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, error: 'Cannot change the status of a delivered order' });
    }

    order.orderStatus = req.body.orderStatus;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
