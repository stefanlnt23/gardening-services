import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  completionDate: {
    type: Date,
    required: [true, 'Completion date is required']
  },
  services: {
    type: [String],
    required: [true, 'At least one service must be selected'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one service must be selected'
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress'
  },
  featured: {
    type: Boolean,
    default: false
  },
  photos: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(url => /^https?:\/\/.+/.test(url));
      },
      message: 'At least one valid photo URL is required'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
