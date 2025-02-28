import connectionToDatabase from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectionToDatabase(); // Ensure DB connection

    const { email } = await req.json();

    const user = await AcceptedUser.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // Generate a reset token (random 32-byte string)
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated Reset Token (raw):", resetToken);

    // Hash the token before storing it in the database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    console.log("Hashed Reset Token (stored in DB):", hashedToken);

    // Set token expiration (1 hour from now)
    const tokenExpiry = Date.now() + 3600000; // 1 hour
    console.log("Token Expiry Time:", new Date(tokenExpiry).toLocaleString());

    // Store hashed token and expiry in the database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // Generate reset password URL
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Password,
      },
    });

    // Send the reset link via email
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return new Response(
      JSON.stringify({ message: "Reset link sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
