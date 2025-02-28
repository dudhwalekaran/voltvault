// models/Bus.js
import mongoose from 'mongoose';

const LoadSchema = new mongoose.Schema({
  location: { type: String, required: true },
  circuitBreaker: {
    type: Boolean,
    default: false, // Default to "off" (false)
  },
  busFrom: { type: String, required: true },
  busSectionFrom: { type: String, required: true },
  pmw: { type: String, required: true },
  qmvar: { type: String, required: true },
});

const Load = mongoose.models.Load || mongoose.model('Load', LoadSchema);

export default Load;
