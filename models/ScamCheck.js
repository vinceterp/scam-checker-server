const mongoose = require('mongoose');

const scamCheckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  input: {
    email: String,
    url: String,
    phoneNumber: String,
    textContent: String,
  },
  result: {
    score: Number,
    flags: [String],
    explanation: String,
    confidence: Number,
  },
  comment: String,
  tag: String,
}, { timestamps: true });

module.exports = mongoose.model('ScamCheck', scamCheckSchema);
