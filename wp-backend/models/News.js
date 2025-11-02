//wp-backend/models/News.js

import { Schema, model } from 'mongoose';

const newsSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  link: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  source: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  scrapedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Index for faster queries
newsSchema.index({ date: -1 });
newsSchema.index({ link: 1 });

export default model('News', newsSchema);