const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  role: {
    type: String, // e.g. "Fullstack", "Frontend", "AI/ML", "Mobile"
    required: true,
  },
  githubLink: {
    type: String,
    default: '',
  },
  resources: [
    {
      title: { type: String },
      url: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
