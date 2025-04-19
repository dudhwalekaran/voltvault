import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "create", "update", "delete"
  dataType: { type: String, required: true }, // e.g., "IBR", "Bus"
  recordId: { type: String, required: true }, // ID of the affected record
  adminEmail: { type: String, required: true }, // Email of the admin performing the action
  adminName: { type: String, required: true }, // Name of the admin
  details: { type: String, required: true }, // Description of the action
  timestamp: { type: Date, default: Date.now }, // When the action occurred
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);