const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Email validation: must be a valid @gmail.com address (bypassed for admins)
  if (email !== 'admin@example.com' && email !== 'admin@luxelle.com') {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email. Must be a valid Gmail address ending with "@gmail.com"' });
    }
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullname,
      email,
      username,
      password, // In a real app, you should hash the password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        // token: generateToken(user._id), // You would generate a token here
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Static admin credentials check
  if (email === 'admin@example.com' && password === 'adminPassword') {
    return res.json({
      _id: 'admin',
      fullname: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      isAdmin: true,
    });
  }

  console.log('Login attempt with:', { email, password }); // Added for debugging

  try {
    const user = await User.findOne({ email });

    console.log('User found in DB:', user); // Added for debugging

    // Compare password with hashed password in DB
    if (user && (await user.comparePassword(password))) {
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
      }

      console.log('Password comparison successful'); // Added for debugging
      res.json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      });
    } else {
      console.log('Password comparison failed'); // Added for debugging
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error); // Added for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Update password if provided
      if (req.body.newPassword) {
        if (!req.body.currentPassword || !(await user.comparePassword(req.body.currentPassword))) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = req.body.newPassword;
      }

      user.fullname = req.body.fullname || user.fullname;
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

      // Update address if provided
      if (req.body.address) {
        user.address = req.body.address;
      }

      // Update isAdmin if provided (be careful with this in production!)
      if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin;
      }

      if (req.body.isBlocked !== undefined) {
        user.isBlocked = req.body.isBlocked;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        username: updatedUser.username,
        phone: updatedUser.phone,
        address: updatedUser.address, // Return address
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser, updateUser, getUserById };