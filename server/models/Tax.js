const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true }, // E.g. 0.18 for 18% GST or flat amount like 2.99
  type: { type: String, required: true, enum: ['percentage', 'flat'] },
  code: { type: String, required: true, unique: true } // E.g. 'gst', 'import_duty', 'processing_fee'
});

module.exports = mongoose.model('Tax', taxSchema);
