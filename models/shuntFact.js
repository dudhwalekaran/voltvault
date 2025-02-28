// models/Bus.js
import mongoose from 'mongoose';

const ShuntSchema = new mongoose.Schema({
  shunt: { type: String, required: true },
});

const ShuntFact = mongoose.models.ShuntFact || mongoose.model('ShuntFact', ShuntSchema);

export default ShuntFact;
