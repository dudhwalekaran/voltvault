import mongoose from "mongoose";

const ExcitationSystemSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    avrType: {
      type: String,
      required: true,
    },
    generatorDeviceName: {
      type: String,
      required: true,
    },
    pssImageUrl: {
      type: String,
      required: true,
    },
    avrImageUrl: {
      type: String,
      required: true,
    },
    oelImageUrl: {
      type: String,
      required: true,
    },
    uelImageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ExcitationSystem ||
  mongoose.model("ExcitationSystem", ExcitationSystemSchema);
