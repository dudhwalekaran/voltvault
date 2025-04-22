import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Turbine from "@/models/Turbine";
import PendingRequest from "@/models/PendingRequest"; // Ensure this model exists
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

    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    console.log("User role:", role);

    if (role === "admin") {
      console.log("Admin role detected, creating Turbine directly");
      const newTurbine = new Turbine({
        location,
        turbineType,
        deviceName,
        imageUrl,
        createdBy: decoded.userId,
      });
      const savedTurbine = await newTurbine.save();
      console.log("Turbine created:", savedTurbine);

      // Log the action to History
      const history = new History({
        action: "create",
        dataType: "Turbine",
        recordId: savedTurbine._id.toString(),
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

      const response = {
        success: true,
        message: "Turbine created successfully",
        turbine: savedTurbine,
      };
      console.log("Sending Response:", response);
      return NextResponse.json(response, { status: 201 });
    }

    console.log("Non-admin role detected, saving to PendingRequest");
    const pendingRequest = new PendingRequest({
      dataType: "Turbine",
      data: { location, turbineType, deviceName, imageUrl },
      submittedBy: decoded.userId || decoded.email || "unknown",
      username: decoded.username || decoded.name || "unknown",
      email: decoded.email || "unknown",
      description: `Add Turbine: ${deviceName} at ${location}`,
      status: "pending",
    });
    const savedPendingRequest = await pendingRequest.save();
    console.log("PendingRequest saved:", savedPendingRequest);

    const response = {
      success: true,
      message: "Turbine request submitted for approval",
      pendingRequest: savedPendingRequest,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 201 });

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