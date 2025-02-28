// models/Bus.js
import mongoose from 'mongoose';

const LccSchema = new mongoose.Schema({
  lcc: { type: String, required: true },
});

const Lcc = mongoose.models.Lcc || mongoose.model('Lcc', LccSchema);

export default Lcc;
