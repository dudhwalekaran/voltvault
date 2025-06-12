import mongoose from 'mongoose';

const ShuntSchema = new mongoose.Schema({
  shunt: {
    type: Number,
    required: [true, 'Shunt value is required'],
    validate: {
      validator: Number.isFinite,
      message: 'Shunt must be a valid number'
    }
  },
});

const ShuntFact = mongoose.models.ShuntFact || mongoose.model('ShuntFact', ShuntSchema);

export default ShuntFact;
