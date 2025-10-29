import mongoose from 'mongoose';

export interface INewsArticle {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new mongoose.Schema<INewsArticle>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    trim: true,
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

// Update the updatedAt field before saving
NewsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create index for better query performance
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ category: 1 });

export default mongoose.models.News || mongoose.model<INewsArticle>('News', NewsSchema);
