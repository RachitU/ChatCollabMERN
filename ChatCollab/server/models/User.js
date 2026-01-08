const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  personalDoc: { type: String, default: '' }
});
module.exports = mongoose.model('User', userSchema);
