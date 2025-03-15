import mongoose from "mongoose";

const PendingRequestSchema = new mongoose.Schema(
  {
    dataType: { type: String, required: true }, // e.g., "Bus"
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // The submitted data (e.g., bus details)
    submittedBy: { type: String, required: true }, // User ID
    username: { type: String, required: true }, // User’s name
    email: { type: String, required: true }, // User’s email
    description: { type: String, required: true }, // e.g., "Add Bus: BusName at Location"
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.models.PendingRequest || mongoose.model("PendingRequest", PendingRequestSchema);