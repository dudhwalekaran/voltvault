// models/Bus.js
import mongoose from 'mongoose';

const ShuntSchema = new mongoose.Schema({
  location: { type: String, required: true },
  circuitBreaker: {
    type: Boolean,
    default: false, // Default to "off" (false)
  },
  busFrom: { type: String, required: true },
  busSectionFrom: { type: String, required: true },
  kv: { type: String, required: true },
  mva: { type: String, required: true },
});

const Shunt = mongoose.models.ShuntCapacitor || mongoose.model('ShuntCapacitor', ShuntSchema);

export default Shunt;
