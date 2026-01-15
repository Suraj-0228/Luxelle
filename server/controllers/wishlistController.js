const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist/:userId
// @access  Public
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Public
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] });
      await User.findByIdAndUpdate(userId, { wishlist: wishlist._id });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist
// @access  Public
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };