const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.fullname = req.body.fullName || user.fullname;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.address) {
        user.address = {
            street: req.body.address.street || user.address.street,
            city: req.body.address.city || user.address.city,
            state: req.body.address.state || user.address.state,
            zip: req.body.address.zip || user.address.zip,
            country: req.body.address.country || user.address.country,
        };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
      phone: updatedUser.phone,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = { updateUserProfile };
