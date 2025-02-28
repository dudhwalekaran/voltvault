import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Use bcryptjs for hashing

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  status: { type: String, default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Pre-save hook to hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Only hash if the password is new or modified
  this.password = await bcrypt.hash(this.password, 10);  // 10 salt rounds for hashing
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
