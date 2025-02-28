// models/Bus.js
import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  location: { type: String, required: true },
  voltagePower: { type: String, required: true },
  nominalKV: { type: String, required: true },
});

const Bus = mongoose.models.Bus || mongoose.model('Bus', BusSchema);

export default Bus;
