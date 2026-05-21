const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  college: {
    type: String,
    required: [true, 'Please add your college name'],
    trim: true,
  },
  branch: {
    type: String,
    required: [true, 'Please add your branch/department'],
    trim: true,
  },
  cgpa: {
    type: Number,
    required: [true, 'Please add your CGPA'],
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10'],
  },
  backlogs: {
    type: Number,
    default: 0,
    min: [0, 'Backlogs cannot be negative'],
  },
  skills: {
    type: [String],
    default: [],
  },
  targetRole: {
    type: String,
    required: [true, 'Please add your target career role'],
    trim: true,
  },
  graduationYear: {
    type: Number,
    required: [true, 'Please add your graduation year'],
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'mentor'],
    default: 'student',
  },
  placementReadinessScore: {
    type: Number,
    default: 0,
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
