import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import History from "@/models/History"; // Import History model for logging
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // For ObjectId validation

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    console.log(`PUT Request for user ID: ${id}`);

    // Validate user ID
    if (!id) {
      console.log("User ID is missing");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid user ID format");
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Connect to the database
    await connectDB();
    console.log("Database connected");

    // Validate authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header or incorrect format");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Decode token
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401, headers: corsHeaders }
      );
    }

    // Restrict to admin users
    if (decoded.status !== "admin") {
      console.log("User is not an admin:", decoded);
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403, headers: corsHeaders }
      );
    }

    // Prevent self-modification
    if (decoded.userId === id) {
      console.log("Admin attempted to modify their own status");
      return NextResponse.json(
        { error: "Cannot modify your own admin status" },
        { status: 403, headers: corsHeaders }
      );
    }

    // Parse request body
    const { action } = await req.json();
    console.log("Action received:", action);

    // Validate action
    if (!action || !["makeAdmin", "removeAdmin"].includes(action)) {
      console.log("Invalid action:", action);
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find the user
    const user = await AcceptedUser.findById(id);
    if (!user) {
      console.log(`User with ID ${id} not found`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Perform the action
    if (action === "makeAdmin") {
      user.adminStatus = "admin";
      await user.save();
      console.log("User updated to admin:", user);

      // Log to History
      const history = new History({
        action: "makeAdmin",
        dataType: "User",
        recordId: user._id.toString(),
        adminEmail: decoded.email || "Unknown",
        adminName: decoded.name || "Unknown",
        details: `Made user an admin: ${user.email}`,
        timestamp: new Date(), // Current date and time: 12:48 PM IST, June 02, 2025
      });
      await history.save();
      console.log("History entry created:", history);

      return NextResponse.json(
        { success: true, message: "User made admin successfully" },
        { status: 200, headers: corsHeaders }
      );
    } else if (action === "removeAdmin") {
      user.adminStatus = "user";
      await user.save();
      console.log("User admin status removed:", user);

      // Log to History
      const history = new History({
        action: "removeAdmin",
        dataType: "User",
        recordId: user._id.toString(),
        adminEmail: decoded.email || "Unknown",
        adminName: decoded.name || "Unknown",
        details: `Removed admin status for user: ${user.email}`,
        timestamp: new Date(),
      });
      await history.save();
      console.log("History entry created:", history);

      return NextResponse.json(
        { success: true, message: "User admin status removed" },
        { status: 200, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error("Error in PUT /api/users/[id]:", error.message, error.stack);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    console.log(`DELETE Request for user ID: ${id}`);

    // Validate user ID
    if (!id) {
      console.log("User ID is missing");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid user ID format");
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Connect to the database
    await connectDB();
    console.log("Database connected");

    // Validate authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header or incorrect format");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Decode token
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401, headers: corsHeaders }
      );
    }

    // Restrict to admin users
    if (decoded.status !== "admin") {
      console.log("User is not an admin:", decoded);
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403, headers: corsHeaders }
      );
    }

    // Prevent self-deletion
    if (decoded.userId === id) {
      console.log("Admin attempted to delete themselves");
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 403, headers: corsHeaders }
      );
    }

    // Delete the user
    const deletedUser = await AcceptedUser.findByIdAndDelete(id);
    if (!deletedUser) {
      console.log(`User with ID ${id} not found`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Log to History
    const history = new History({
      action: "delete",
      dataType: "User",
      recordId: id,
      adminEmail: decoded.email || "Unknown",
      adminName: decoded.name || "Unknown",
      details: `Deleted user: ${deletedUser.email}`,
      timestamp: new Date(),
    });
    await history.save();
    console.log("History entry created:", history);

    console.log("User deleted:", deletedUser);
    return NextResponse.json(
      { success: true, message: "User deleted permanently" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in DELETE /api/users/[id]:", error.message, error.stack);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
