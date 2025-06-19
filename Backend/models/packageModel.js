const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [{ type: String }],
  image: { type: String, default: null } // Make image optional with default value null
});

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Adding price field
  days: [daySchema]
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
