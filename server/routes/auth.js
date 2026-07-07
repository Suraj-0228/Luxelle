const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser, updateUser, getUserById } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, getUserById);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id', protect, updateUser);

module.exports = router;