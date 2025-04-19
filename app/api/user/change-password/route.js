import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function PUT(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { newPassword } = await req.json();
    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New hashed password:", hashedPassword);

    // Update the user's password directly using findOneAndUpdate
    const updateResult = await AcceptedUser.findOneAndUpdate(
      { email: decoded.email },
      { $set: { password: hashedPassword, updatedAt: new Date() } },
      { new: true } // Return the updated document
    );

    if (!updateResult) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log("Updated hashed password in database:", updateResult.password);

    if (updateResult.password !== hashedPassword) {
      throw new Error("Failed to update password in database");
    }

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in PUT /api/user/change-password:", error.message, error.stack);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}