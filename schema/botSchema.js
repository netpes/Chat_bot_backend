const mongoose = require("mongoose");

const bot_schema = mongoose.Schema({
  admin: { type: String, required: false },
  question: { type: String, required: false },
  answer: { type: Array, required: false },
  approved: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("bot", bot_schema);
