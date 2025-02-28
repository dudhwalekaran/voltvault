import mongoose from "mongoose";

// Create the schema for a Single Line Diagram
const SingleLineDiagramSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true, // Make description required
    },
    imageUrl: {
      type: String,
      required: true, // Make imageUrl required
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the current time when the document is created
    },
  },
  {
    timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the model from the schema
const SingleLineDiagram = mongoose.models.SingleLineDiagram || mongoose.model("SingleLineDiagram", SingleLineDiagramSchema);

export default SingleLineDiagram;
