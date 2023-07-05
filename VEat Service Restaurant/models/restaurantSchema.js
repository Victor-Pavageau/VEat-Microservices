const mongoose = require('mongoose');
const scheduleSchema =  require('./scheduleSchema');
const articleSchema =  require('./articleSchema');

const restaurantSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  restaurantOwnerId: { type: String, required: true },
  restaurantName: { type: String, required: true },
  address: {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    fullAddress: { type: String, required: true },
  },
  tags: [String],
  logo: { type: String, required: true },
  menus: [
    {
      uid: { type: String, required: true },
      isUnavailable: { type: Boolean, default: false },
      name: { type: String, required: true },
      photo: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      articles: [articleSchema],
    }
  ],
  articles: [articleSchema],
  schedule: [scheduleSchema],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
