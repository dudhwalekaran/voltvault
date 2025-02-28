import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  affected_section: { type: String, required: true },
  affected_id: { type: String, required: true },
  action: { type: String, required: true },  // Example: "created", "updated", "deleted"
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);
