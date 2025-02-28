import mongoose from "mongoose";

const turbineSchema = new mongoose.Schema({
  location: String,
  turbineType: String,
  deviceName: String,
  imageUrl: String, // URL of the image from Cloudinary
});

const Turbine = mongoose.models.Turbine || mongoose.model("Turbine", turbineSchema);

export default Turbine;
