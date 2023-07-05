const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  isUnavailable: { type: Boolean, default: false },
  photo: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: false },
  category: { type: String, required: false },
  tags: [String],
});

module.exports = articleSchema;