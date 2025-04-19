import { NextResponse } from "next/server";
import connect from "@/lib/db";
import SeriesCapacitor from "@/models/seriesCapacitor";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("=== POST /api/series-capacitor Started ===");
  try {
    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }

    // Authenticate
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
    let body;
    try {
      body = await req.json();
      console.log("Received Data:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { location, mvar, compensation } = body;
    if (!location || !mvar || !compensation) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect DB
    await connect();
    console.log("DB Connected");

    // Direct save
    const seriesCapacitor = new SeriesCapacitor({
      location,
      mvar,
      compensation,
      status: decoded.status === "admin" ? "approved" : "pending",
      createdBy: decoded.userId,
    });
    const savedSeriesCapacitor = await seriesCapacitor.save();
    console.log("Series Capacitor Saved:", savedSeriesCapacitor);

    // Log history for admins
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      const history = new History({
        action: "create",
        dataType: "SeriesCapacitor",
        recordId: savedSeriesCapacitor._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created Series Capacitor: ${JSON.stringify({
          location,
          mvar,
          compensation,
        })}`,
      });
      await history.save();
      console.log("History entry created:", history);
    } else {
      console.log("User is not admin, skipping history log");
    }

    // Return with 200
    const response = {
      success: true,
      message: "Series Capacitor created successfully",
      seriesCapacitor: savedSeriesCapacitor,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/series-capacitor Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create Series Capacitor", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  console.log("=== GET /api/series-capacitor Started ===");
  try {
    // Authenticate
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
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET missing!");
        throw new Error("JWT_SECRET not set");
      }
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("JWT Verify Failed:", error.message);
      return NextResponse.json({ error: "Invalid token", details: error.message }, { status: 401 });
    }

    // Connect DB
    await connect();
    console.log("DB Connected");

    // Fetch capacitors based on user role
    let capacitors;
    if (decoded.status === "admin") {
      capacitors = await SeriesCapacitor.find();
    } else {
      capacitors = await SeriesCapacitor.find({
        $or: [{ createdBy: decoded.userId }, { status: "approved" }],
      });
    }

    // Always return 200 with an empty array if no data
    console.log(`Series Capacitors Fetched: ${capacitors.length}`);
    return NextResponse.json(
      {
        success: true,
        capacitors: capacitors || [], // Return empty array if no data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("=== GET /api/series-capacitor Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Series Capacitors", details: error.message },
      { status: 500 }
    );
  }
}