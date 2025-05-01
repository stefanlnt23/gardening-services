import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a service title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a service description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  benefits: {
    type: String,
    required: [true, 'Please provide service benefits'],
    maxlength: [1000, 'Benefits cannot be more than 1000 characters'],
  },
  whatsIncluded: {
    type: String,
    required: [true, 'Please provide what is included'],
    maxlength: [1000, 'Whats included cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  duration: {
    type: String,
    required: [true, 'Please provide service duration'],
  },
  coverage: {
    type: String,
    required: [true, 'Please provide service coverage area'],
  },
  photos: [{
    type: String,
    required: [true, 'Please provide at least one photo'],
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
