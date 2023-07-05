const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  category: { type: String, required: true },
});

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
