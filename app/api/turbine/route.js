import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Turbine from "@/models/Turbine";
import History from "@/models/History";
import { handleSubmission } from "@/lib/handleSubmission";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    console.log("=== POST /api/turbine Started ===");

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }

    // Validate token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid token");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("JWT Verify Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

    // Parse body
    let body;
    try {
      body = await req.json();
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body", details: error.message },
        { status: 400 }
      );
    }

    const { location, turbineType, deviceName, imageUrl } = body;
    if (!location || !turbineType || !deviceName || !imageUrl) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          error:
            "Missing required fields: location, turbineType, deviceName, and imageUrl are required",
        },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();
    console.log("Database connected successfully");

    // Handle submission
    const result = await handleSubmission({
      req,
      dataType: "Turbine",
      data: {
        location,
        turbineType,
        deviceName,
        imageUrl,
        status: decoded.status === "admin" ? "approved" : "pending",
        createdBy: decoded.userId,
      },
      Model: Turbine,
      description: `Add Turbine: ${deviceName} at ${location}`,
    });

    console.log("handleSubmission Result:", JSON.stringify(result, null, 2));

    if (result.error) {
      console.error("Error from handleSubmission:", result.error);
      return NextResponse.json(
        { error: result.error.message, details: result.error.details },
        { status: result.error.status || 500 }
      );
    }

    if (!result.success || !result.success._id) {
      console.error("Unexpected handleSubmission result:", result);
      return NextResponse.json(
        { error: "Unexpected server error: Invalid result from submission" },
        { status: 500 }
      );
    }

    const turbine = result.success;
    console.log("Turbine created:", turbine);

    // Log to History if approved (admin)
    if (turbine.status === "approved") {
      console.log("Logging history for approved Turbine...");
      const history = new History({
        action: "create",
        dataType: "Turbine",
        recordId: turbine._id.toString(),
        adminEmail: decoded.email || decoded.userId || "unknown",
        adminName: decoded.username || decoded.name || "unknown",
        details: `Created Turbine: ${JSON.stringify({
          location,
          turbineType,
          deviceName,
          imageUrl,
        })}`,
      });
      await history.save();
      console.log("History entry created:", history);
    } else {
      console.log("Turbine pending approval, skipping history log");
    }

    const response = {
      success: true,
      message:
        turbine.status === "approved"
          ? "Turbine created successfully"
          : "Turbine request submitted for approval",
      turbine,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/turbine Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    console.log("=== GET /api/turbine Started ===");

    // Validate token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid token");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("JWT Verify Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

    // Connect to DB
    await connectDB();
    console.log("Database connected successfully");

    // Fetch turbines based on role
    const turbines =
      decoded.status === "admin"
        ? await Turbine.find()
        : await Turbine.find({
            $or: [{ createdBy: decoded.userId }, { status: "approved" }],
          });

    console.log("Fetched Turbines:", turbines.length);
    if (!turbines || turbines.length === 0) {
      console.log("No Turbines found for this user");
      return NextResponse.json(
        { success: true, message: "No Turbines found", turbines: [] },
        { status: 200 }
      );
    }

    const response = { success: true, turbines };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== GET /api/turbine Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Turbines", details: error.message },
      { status: 500 }
    );
  }
}