const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  addresses: {
    restaurantAddress: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      fullAddress: { type: String, required: true },
    },
    clientAddress: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      fullAddress: { type: String, required: true },
    },
  },
  clientId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  driverId: { type: String, required: false },
  isApprovedByRestaurant: { type: Boolean, default: false },
  isApprovedByDriver: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false },
  price: {
    subtotal: { type: Number, required: true },
    fees: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  dates: {
    orderTimestamp: { type: String, required: true },
    deliveryTimestamp: { type: String },
  },
  orderDetails: [
    {
      itemID: { type: String, required: true},
      itemType: {type: String, required: true},
      quantity: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
