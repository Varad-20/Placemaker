const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number, // 30 or 60 days
    default: 30,
  },
  weeklyGoals: [
    {
      weekNumber: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String },
    },
  ],
  tasks: [
    {
      weekNumber: { type: Number, required: true },
      dayNumber: { type: Number, required: true },
      title: { type: String, required: true },
      category: {
        type: String,
        enum: ['DSA', 'Web development', 'Aptitude', 'Communication', 'Resume building', 'Interview preparation', 'Other'],
        required: true,
      },
      description: { type: String },
      isCompleted: { type: Boolean, default: false },
      resources: [{ title: String, url: String }],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
