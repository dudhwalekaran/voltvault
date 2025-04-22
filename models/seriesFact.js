import mongoose from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  series: {
    type: String,
    required: [true, "Series fact is required"],
    minlength: [3, "Series fact must be at least 3 characters"],
    trim: true,
  },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const SeriesFact = mongoose.models.SeriesFact || mongoose.model('SeriesFact', SeriesSchema);

export default SeriesFact;