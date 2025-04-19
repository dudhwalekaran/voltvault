import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import jwt from "jsonwebtoken";

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

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();
    console.log("Database connected");

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header or incorrect format");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    const { action } = await req.json();
    if (!action || action !== "removeAdmin") {
      console.log("Invalid action:", action);
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await AcceptedUser.findById(id);
    if (!user) {
      console.log(`User with ID ${id} not found`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    user.adminStatus = "user"; // Change adminStatus to user
    await user.save();
    console.log("User updated:", user);

    return NextResponse.json(
      { success: true, message: "User admin status removed" },
      { status: 200, headers: corsHeaders }
    );
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

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();
    console.log("Database connected");

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header or incorrect format");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    const deletedUser = await AcceptedUser.findByIdAndDelete(id);
    if (!deletedUser) {
      console.log(`User with ID ${id} not found`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

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