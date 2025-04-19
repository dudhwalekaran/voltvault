import mongoose from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  series: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdBy: { type: String, required: true }, // Assuming userId is a string; adjust if it's ObjectId
  createdAt: { type: Date, default: Date.now }, // For sorting in GET
});

// Prevent model redefinition
const SeriesFact = mongoose.models.SeriesFact || mongoose.model('SeriesFact', SeriesSchema);

export default SeriesFact;