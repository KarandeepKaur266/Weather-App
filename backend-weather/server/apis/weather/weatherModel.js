const mongoose = require('mongoose');

let weatherSchema = new mongoose.Schema({
  city: { type: String, default: "", lowercase: true},
  temperature: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  humidity:{type: Number, required: true},
  windSpeed: {type: Number, required: true},
  feelsLike: {type: Number, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Weather", weatherSchema);