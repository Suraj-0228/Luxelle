const express = require('express');
const router = express.Router();
const Tax = require('../models/Tax');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all taxes
router.get('/', async (req, res) => {
  try {
    const taxes = await Tax.find({});
    res.status(200).json({ success: true, data: taxes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create new tax
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, rate, type, code } = req.body;
    const tax = new Tax({ name, rate, type, code });
    await tax.save();
    res.status(201).json({ success: true, data: tax });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update tax by ID
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, rate, type, code } = req.body;
    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      { name, rate, type, code },
      { new: true, runValidators: true }
    );
    if (!tax) {
      return res.status(404).json({ success: false, error: 'Tax not found' });
    }
    res.status(200).json({ success: true, data: tax });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete tax by ID
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const tax = await Tax.findByIdAndDelete(req.params.id);
    if (!tax) {
      return res.status(404).json({ success: false, error: 'Tax not found' });
    }
    res.status(200).json({ success: true, data: tax });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
