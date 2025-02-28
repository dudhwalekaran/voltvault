import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AcceptedUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    status: { type: String, enum: ["active", "disabled", "pending disable"], default: "active" },
    adminStatus: { type: String, enum: ["user", "admin"], default: "user" },

    // 🔴 Add fields for password reset
    resetPasswordToken: { type: String }, 
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving if modified
AcceptedUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const AcceptedUser = mongoose.models.AcceptedUser || mongoose.model("AcceptedUser", AcceptedUserSchema);

export default AcceptedUser;
