const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullname, email, username, password } = req.body;

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

    // In a real app, you would compare the password with the hashed password
    if (user && (password === user.password)) {
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
        // token: generateToken(user._id),
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
      user.fullname = req.body.fullname || user.fullname;
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;

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
        address: updatedUser.address, // Return address
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser, updateUser };