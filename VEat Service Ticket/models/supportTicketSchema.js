const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  content: {
    title: { type: String, required: true },
    message: { type: String, required: true },
  },
  category: { type: String, required: true },
  clientID: { type: String, required: true },
  orderID: { type: String },
  files: [
    {
      filename: { type: String, required: true },
      type: { type: String, required: true },
      title: { type: String, required: true },
    },
  ],
  status: {
    type: String,
    enum: ['Opened', 'Pending', 'Closed', 'Solved'],
    required: true,
  },
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
