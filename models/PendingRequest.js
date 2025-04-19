import mongoose from "mongoose";

const PendingRequestSchema = new mongoose.Schema(
  {
    dataType: { type: String, required: true }, // e.g., "Bus", "IBR", "Load"
    data: { type: Object, required: true }, // The submitted data (flexible for any data type)
    submittedBy: { type: String, required: true }, // User's email
    username: { type: String, required: true }, // User's name
    email: { type: String, required: true }, // User's email
    description: { type: String, required: true }, // Description of the request
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PendingRequest || mongoose.model("PendingRequest", PendingRequestSchema);