import { Schema, model, models } from "mongoose";

const transmissionLineSchema = new Schema({
  location1: {
    type: String,
  },
  location2: {
    type: String,
  },
  type: {
    type: String,
  },
  circuitBreakerStatus: {
    type: String,
  },
  busFrom: {
    type: String,
  },
  busSectionFrom: {
    type: String,
  },
  busTo: {
    type: String,
  },
  busSectionTo: {
    type: String,
  },
  kv: {
    type: String,
  },
  positiveSequenceRohmsperunitlength: {
    type: String,
  },
  positiveSequenceXohmsperunitlength: {
    type: String,
  },
  positiveSequenceBseimensperunitlength: {
    type: String,
  },
  negativeSequenceRohmsperunitlength: {
    type: String,
  },
  negativeSequenceXohmsperunitlength: {
    type: String,
  },
  negativeSequenceBseimensperunitlength: {
    type: String,
  },
  lengthKm: {
    type: String,
  },
  lineReactorFrom: {
    type: String,
  },
  lineReactorTo: {
    type: String,
  },
}, { collection: 'transmissionlines' }); // Explicitly define collection name

const TransmissionLine = models.TransmissionLine || model("TransmissionLine", transmissionLineSchema);

export default TransmissionLine;
