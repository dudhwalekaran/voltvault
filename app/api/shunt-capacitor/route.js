import { NextResponse } from "next/server";
import connect from "@/lib/db";
import ShuntCapacitor from "@/models/shuntCapacitor";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("=== POST /api/shunt-capacitor Started ===");
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

    const { location, circuitBreaker, busFrom, busSectionFrom, kv, mva } = body;
    if (!location || circuitBreaker === undefined || !busFrom || !busSectionFrom || kv === "" || mva === "") {
      console.log("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect DB
    await connect();
    console.log("DB Connected");

    // Direct save
    const shuntCapacitor = new ShuntCapacitor({
      location,
      circuitBreaker,
      busFrom,
      busSectionFrom,
      kv,
      mva,
      status: decoded.status === "admin" ? "approved" : "pending",
      createdBy: decoded.userId,
    });
    const savedShuntCapacitor = await shuntCapacitor.save();
    console.log("Shunt Capacitor Saved:", savedShuntCapacitor);

    // Log history for admins
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      const history = new History({
        action: "create",
        dataType: "ShuntCapacitor",
        recordId: savedShuntCapacitor._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created Shunt Capacitor: ${JSON.stringify({
          location,
          circuitBreaker,
          busFrom,
          busSectionFrom,
          kv,
          mva,
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
      message: "Shunt Capacitor created successfully",
      shuntCapacitor: savedShuntCapacitor,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/shunt-capacitor Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create Shunt Capacitor", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  console.log("=== GET /api/shunt-capacitor Started ===");
  try {
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

    await connect();
    console.log("DB Connected");

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const status = url.searchParams.get("status");

    let query = {};
    if (decoded.status !== "admin") {
      query = { $or: [{ createdBy: decoded.userId }, { status: "approved" }] };
    }
    if (status) query.status = status;

    const shunts = await ShuntCapacitor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await ShuntCapacitor.countDocuments(query);

    console.log(`Shunt Capacitors Fetched: ${shunts.length} (Page ${page}, Total ${total})`);
    return NextResponse.json(
      {
        success: true,
        message: shunts.length === 0 ? "No Shunt Capacitors found" : undefined,
        shunts: shunts || [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("=== GET /api/shunt-capacitor Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Shunt Capacitors", details: error.message },
      { status: 500 }
    );
  }
}