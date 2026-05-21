const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
    default: 0,
  },
  extractedSkills: {
    type: [String],
    default: [],
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  suggestions: {
    type: [String],
    default: [],
  },
  formattingScore: {
    type: Number,
    default: 0,
  },
  keywordDensityScore: {
    type: Number,
    default: 0,
  },
  actionWordsScore: {
    type: Number,
    default: 0,
  },
  grammarSuggestions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
