import mongoose from 'mongoose';

const VscSchema = new mongoose.Schema({
  vsc: {
    type: Number,
    required: [true, 'VSC value is required'],
    validate: {
      validator: Number.isInteger,
      message: 'VSC must be a valid number'
    }
  },
});

const Vsc = mongoose.models.Vsc || mongoose.model('Vsc', VscSchema);

export default Vsc;
