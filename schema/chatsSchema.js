const mongoose = require("mongoose");

const chat_schema = mongoose.Schema({
  user: { type: String, required: true },
  admin: { type: String, required: false },
  chat: { type: Array, required: false },
});

module.exports = mongoose.model("chats", chat_schema);
