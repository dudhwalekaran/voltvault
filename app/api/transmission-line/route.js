import { NextResponse } from "next/server";
import connect from "@/lib/db";
import TransmissionLine from "@/models/transmissionLine";
import History from "@/models/History";
import PendingRequest from "@/models/PendingRequest";
import jwt from "jsonwebtoken";

// POST method to create a new Transmission Line
export async function POST(req) {
  try {
    console.log("=== POST /api/transmission-line Started ===");

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

    const {
      location1,
      location2,
      type,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      kv,
      positiveSequenceRohmsperunitlength,
      positiveSequenceXohmsperunitlength,
      positiveSequenceBseimensperunitlength,
      negativeSequenceRohmsperunitlength,
      negativeSequenceXohmsperunitlength,
      negativeSequenceBseimensperunitlength,
      lengthKm,
      lineReactorFrom,
      lineReactorTo,
    } = body;

    if (!location1 || !location2 || !kv) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          error:
            "Missing required fields: location1, location2, and kv are required",
        },
        { status: 400 }
      );
    }

    // Connect to DB
    await connect();
    console.log("Database connected successfully");

    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    console.log("User role:", role);

    const transmissionLineData = {
      location1,
      location2,
      type,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      kv,
      positiveSequenceRohmsperunitlength,
      positiveSequenceXohmsperunitlength,
      positiveSequenceBseimensperunitlength,
      negativeSequenceRohmsperunitlength,
      negativeSequenceXohmsperunitlength,
      negativeSequenceBseimensperunitlength,
      lengthKm,
      lineReactorFrom,
      lineReactorTo,
      createdBy: decoded.userId, // Add createdBy for consistency
    };
    const description = `Add Transmission Line: ${location1} to ${location2}`;

    let response;
    if (role === "admin") {
      console.log("Admin role detected, creating Transmission Line directly");
      const newTransmissionLine = new TransmissionLine(transmissionLineData);
      const savedTransmissionLine = await newTransmissionLine.save();
      console.log("Transmission Line saved:", savedTransmissionLine);

      // Log to History
      const history = new History({
        action: "create",
        dataType: "TransmissionLine",
        recordId: savedTransmissionLine._id.toString(),
        adminEmail: decoded.email || "unknown",
        adminName: decoded.username || decoded.name || "unknown",
        details: `Created Transmission Line: ${JSON.stringify(
          transmissionLineData
        )}`,
      });
      await history.save();
      console.log("History entry created:", history);

      response = {
        success: true,
        message: "Transmission Line created successfully",
        transmissionLine: savedTransmissionLine,
      };
    } else if (role === "user") {
      console.log(
        "User role detected, saving Transmission Line to PendingRequest"
      );
      const pendingRequest = new PendingRequest({
        dataType: "TransmissionLine",
        data: transmissionLineData,
        submittedBy: decoded.userId || decoded.email || "unknown",
        username: decoded.username || decoded.name || "unknown",
        email: decoded.email || "unknown",
        description,
        status: "pending",
      });
      const savedPendingRequest = await pendingRequest.save();
      console.log("PendingRequest saved:", savedPendingRequest);

      response = {
        success: true,
        message: "Transmission Line request submitted for approval",
        pendingRequest: savedPendingRequest,
      };
    } else {
      console.log("Invalid role detected:", role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error(
      "=== POST /api/transmission-line Failed ===",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch Transmission Lines
export async function GET(req) {
  try {
    console.log("=== GET /api/transmission-line Started ===");

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
    await connect();
    console.log("Database connected successfully");

    // Fetch based on role
    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    const transmissionLines =
      role === "admin"
        ? await TransmissionLine.find()
        : await TransmissionLine.find({
            $or: [{ createdBy: decoded.userId }, { status: "approved" }],
          });

    console.log("Fetched Transmission Lines:", transmissionLines.length);
    if (!transmissionLines || transmissionLines.length === 0) {
      console.log("No Transmission Lines found for this user");
      return NextResponse.json(
        {
          success: true,
          message: "No Transmission Lines found",
          transmissionLines: [],
        },
        { status: 200 }
      );
    }

    const response = { success: true, transmissionLines };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error(
      "=== GET /api/transmission-line Failed ===",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Failed to fetch Transmission Lines", detailsWitness: error.message },
      { status: 500 }
    );
  }
}