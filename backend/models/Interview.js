const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['HR', 'Technical', 'Behavioral'],
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      category: { type: String },
    },
  ],
  answers: [
    {
      questionText: { type: String, required: true },
      answerText: { type: String, required: true },
      feedback: { type: String },
      score: { type: Number, min: 0, max: 100 },
      confidenceScore: { type: Number, min: 0, max: 100 },
    },
  ],
  overallScore: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: '',
  },
  confidenceScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Interview', InterviewSchema);
