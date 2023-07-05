const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  timeSpan: [
    {
      openTime: { type: String, required: true },
      closureTime: { type: String, required: true },
    }
  ],
});

module.exports = scheduleSchema;