import connectionToDatabase from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectionToDatabase();

    const { token, password } = await req.json();
    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Token and password are required" }),
        { status: 400 }
      );
    }

    // Hash the received token to compare with the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Received Token (hashed):", hashedToken);

    // Find user by hashed reset token and check if it is not expired
    const user = await AcceptedUser.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.log("No user found or token is expired.");
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("New Hashed Password:", hashedPassword);

    // Update user password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save(); // Save updated user data

    return new Response(
      JSON.stringify({ message: "Password reset successful" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
