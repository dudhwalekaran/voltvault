import { NextResponse } from "next/server";
import connect from "@/lib/db";
import ShuntFact from "@/models/shuntFact";
import PendingRequest from "@/models/PendingRequest"; // Ensure this model exists
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  console.log("=== POST /api/shunt-fact Started ===");

  try {
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }

    // Validate token
    const authHeader = req.headers.get("authorization");
    console.log("Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid token");
      return NextResponse.json({ error: "Unauthorized: Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("JWT Verify Failed:", error.message);
      return NextResponse.json({ error: "Invalid token", details: error.message }, { status: 401 });
    }

    // Parse body
    let shunt;
    try {
      const body = await req.json();
      shunt = body.shunt;
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!shunt) {
      console.log("Missing shunt field");
      return NextResponse.json({ error: "Missing required field: shunt" }, { status: 400 });
    }

    // Connect DB
    await connect();
    console.log("DB Connected");

    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    console.log("User role:", role);

    if (role === "admin") {
      console.log("Admin role detected, creating Shunt Fact directly");
      const newShunt = new ShuntFact({
        shunt,
        createdBy: decoded.userId,
      });
      const savedShunt = await newShunt.save();
      console.log("Shunt Fact Saved:", savedShunt);

      // Log the action to History
      const history = new History({
        action: "create",
        dataType: "ShuntFact",
        recordId: savedShunt._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created Shunt Fact: ${JSON.stringify({ shunt })}`,
      });
      await history.save();
      console.log("History entry created:", history);

      const response = {
        success: true,
        message: "Shunt Fact created successfully!",
        shunt: savedShunt,
      };
      console.log("Sending Response:", response);
      return NextResponse.json(response, { status: 201 });
    }

    console.log("Non-admin role detected, saving to PendingRequest");
    const pendingRequest = new PendingRequest({
      dataType: "ShuntFact",
      data: { shunt },
      submittedBy: decoded.userId || decoded.email || "unknown",
      username: decoded.username || decoded.name || "unknown",
      email: decoded.email || "unknown",
      description: `Add Shunt Fact: ${shunt}`,
      status: "pending",
    });
    const savedPendingRequest = await pendingRequest.save();
    console.log("PendingRequest saved:", savedPendingRequest);

    const response = {
      success: true,
      message: "Shunt Fact request submitted for approval",
      pendingRequest: savedPendingRequest,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("=== POST /api/shunt-fact Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  console.log("=== GET /api/shunt-fact Started ===");

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid token");
      return NextResponse.json({ error: "Unauthorized: Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("JWT Verify Failed:", error.message);
      return NextResponse.json({ error: "Invalid token", details: error.message }, { status: 401 });
    }

    await connect();
    console.log("DB Connected");

    let shunts;
    if (decoded.status === "admin") {
      shunts = await ShuntFact.find();
    } else {
      shunts = await ShuntFact.find({
        $or: [{ createdBy: decoded.userId }, { status: "approved" }],
      });
    }

    console.log("Shunt Facts Fetched:", shunts.length);
    return NextResponse.json({ shunts: shunts || [] }, { status: 200 });

  } catch (error) {
    console.error("=== GET /api/shunt-fact Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Shunt Facts", details: error.message },
      { status: 500 }
    );
  }
}