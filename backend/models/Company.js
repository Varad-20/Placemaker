const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  minCGPA: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  eligibleBranches: {
    type: [String],
    default: [], // e.g., ["CSE", "ECE", "IT"]
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  type: {
    type: String,
    enum: ['Product', 'Service', 'Startup'],
    required: true,
  },
  package: {
    type: Number, // LPA
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', CompanySchema);
