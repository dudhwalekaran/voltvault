import connectionToDatabase from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectionToDatabase();

    const { token, password } = await req.json();
    if (!token || !password) {
      return new Response(JSON.stringify({ message: "Token and password are required" }), { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Received Token (hashed):", hashedToken);

    const user = await AcceptedUser.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 400 });
    }

    console.log("User found for reset:", user.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("New Hashed Password:", hashedPassword);

    await AcceptedUser.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
      }
    );

    console.log("Password reset successful for:", user.email);
    return new Response(JSON.stringify({ message: "Password reset successful" }), { status: 200 });
  } catch (error) {
    console.error("Error in reset password:", error.message);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}