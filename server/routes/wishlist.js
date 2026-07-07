const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:userId').get(protect, getWishlist);
router.route('/').post(protect, addToWishlist);
router.route('/').delete(protect, removeFromWishlist);

module.exports = router;
