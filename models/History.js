import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    action: { type: String, required: true, enum: ["create", "update", "delete", "reject"] },
    dataType: { type: String, required: true }, // e.g., "Bus", "Load", "Generator", "Shunt Capacitor", "Reactor"
    recordId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminName: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.History || mongoose.model("History", HistorySchema);