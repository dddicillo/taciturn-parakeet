const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, required: true, index: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);