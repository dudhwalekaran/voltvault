// models/Bus.js
import mongoose from 'mongoose';

const seriesCapacitorSchema = new mongoose.Schema({
  location: { type: String, required: true },
  mvar: { type: String, required: true },
  compensation: { type: String, required: true },
});

const Capacitor = mongoose.models.SeriesCapacitor || mongoose.model('SeriesCapacitor', seriesCapacitorSchema);

export default Capacitor;
