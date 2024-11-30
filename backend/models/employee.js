const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  mobile: { type: String },
  designation: { type: String},
  gender: { type: String},
  courses: { type: [String]},
  img: { type: String }, // Store image path
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
