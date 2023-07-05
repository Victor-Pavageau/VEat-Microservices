const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  restaurantId: { type: String, required: true },
  userId: { type : String, required: true },
  note: { type : Number, required: true },
  comment: { type : String }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
