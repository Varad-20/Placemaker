const mongoose = require('mongoose');

const TopicProgressSchema = new mongoose.Schema({
  solved: { type: Number, default: 0 },
  total: { type: Number, default: 30 }, // Total questions in this syllabus
});

const DSAProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  topics: {
    Arrays: { type: TopicProgressSchema, default: () => ({}) },
    Strings: { type: TopicProgressSchema, default: () => ({}) },
    LinkedLists: { type: TopicProgressSchema, default: () => ({}) },
    Trees: { type: TopicProgressSchema, default: () => ({}) },
    Graphs: { type: TopicProgressSchema, default: () => ({}) },
    DP: { type: TopicProgressSchema, default: () => ({}) },
    Recursion: { type: TopicProgressSchema, default: () => ({}) },
  },
  totalSolved: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DSAProgress', DSAProgressSchema);
