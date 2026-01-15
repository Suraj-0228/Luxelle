const express = require('express');
const router = express.Router();
const { createOrder, getOrders, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.route('/').post(createOrder).get(getAllOrders);
router.get('/user/:userId', getOrders);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
