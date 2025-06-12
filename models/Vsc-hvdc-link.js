// models/Bus.js
import mongoose from 'mongoose';

const VscSchema = new mongoose.Schema({
  vsc: { type: String, required: true },
});

const Vsc = mongoose.models.Vsc || mongoose.model('Vsc', VscSchema);

export default Vsc;
