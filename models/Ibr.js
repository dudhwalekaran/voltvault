// models/Bus.js
import mongoose from 'mongoose';

const IbrSchema = new mongoose.Schema({
  ibr: { type: String, required: true },
});

const Ibr = mongoose.models.Ibr || mongoose.model('Ibr', IbrSchema);

export default Ibr;
