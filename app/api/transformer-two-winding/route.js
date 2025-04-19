import { NextResponse } from "next/server";
import connect from "@/lib/db";
import TransformerTwoWinding from "@/models/transformer-two-winding";
import History from "@/models/History";
import PendingRequest from "@/models/PendingRequest";
import jwt from "jsonwebtoken";

// POST method to create a new Transformer Two Winding
export async function POST(req) {
  try {
    console.log("=== POST /api/transformer-two-winding Started ===");

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: No token provided or incorrect format");
      return NextResponse.json(
        { error: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
      console.log("Received data:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body", details: error.message },
        { status: 400 }
      );
    }

    const {
      location,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      mva,
      kvprimary,
      kvsecondary,
      r,
      x,
      TapPrimary,
      TapSecondary,
      primaryWindingConnection,
      primaryConnectionGrounding,
      secondaryWindingConnection,
      secondaryConnectionGrounding,
      angle,
    } = body;

    if (!location || !mva || !kvprimary) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: location, mva, and kvprimary are required" },
        { status: 400 }
      );
    }

    console.log("Connecting to database...");
    await connect();
    console.log("Database connected successfully");

    const role = decoded.status;
    console.log("User role:", role);

    const transformerData = {
      location,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      mva,
      kvprimary,
      kvsecondary,
      r,
      x,
      TapPrimary,
      TapSecondary,
      primaryWindingConnection,
      primaryConnectionGrounding,
      secondaryWindingConnection,
      secondaryConnectionGrounding,
      angle,
      createdBy: decoded.userId, // Add for GET filtering
    };
    const description = `Add Transformer Two Winding: ${location}`;

    let response;
    if (role === "admin") {
      console.log("Admin role detected, creating Transformer Two Winding...");
      const newTransformer = new TransformerTwoWinding(transformerData);
      const savedTransformer = await newTransformer.save();
      console.log("Transformer saved:", savedTransformer);

      console.log("Logging to History...");
      const history = new History({
        action: "create",
        dataType: "TransformerTwoWinding",
        recordId: savedTransformer._id.toString(),
        adminEmail: decoded.email || "unknown",
        adminName: decoded.username || decoded.name || "unknown",
        details: `Created Transformer: ${JSON.stringify(transformerData)}`,
      });
      await history.save();
      console.log("History entry created:", history);

      response = {
        success: true,
        message: "Transformer created successfully",
        transformer: savedTransformer,
      };
    } else if (role === "user") {
      console.log("User role detected, creating PendingRequest...");
      const pendingRequest = new PendingRequest({
        dataType: "TransformerTwoWinding",
        data: transformerData,
        submittedBy: decoded.email || "unknown",
        username: decoded.username || decoded.name || "unknown",
        email: decoded.email || "unknown",
        description,
        status: "pending",
      });
      const savedPendingRequest = await pendingRequest.save();
      console.log("PendingRequest saved:", savedPendingRequest);

      response = {
        success: true,
        message: "Request submitted for approval",
        pendingRequest: savedPendingRequest,
      };
    } else {
      console.log("Invalid role:", role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("=== POST /api/transformer-two-winding Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create Transformer Two Winding", details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all Transformer Two Windings
export async function GET(req) {
  try {
    console.log("=== GET /api/transformer-two-winding Started ===");

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: No token provided or incorrect format");
      return NextResponse.json(
        { error: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    console.log("Connecting to database...");
    await connect();
    console.log("Database connected successfully");

    const transformers =
      decoded.status === "admin"
        ? await TransformerTwoWinding.find()
        : await TransformerTwoWinding.find({
            $or: [{ createdBy: decoded.userId }, { status: "approved" }],
          });

    console.log("Fetched Transformers:", transformers.length);
    if (!transformers || transformers.length === 0) {
      console.log("No Transformer Two Windings found");
      return NextResponse.json(
        { success: true, message: "No Transformer Two Windings found", transformers: [] },
        { status: 200 }
      );
    }

    console.log("Transformers found:", transformers.map(t => t._id));
    return NextResponse.json({ success: true, transformers }, { status: 200 });

  } catch (error) {
    console.error("=== GET /api/transformer-two-winding Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Transformer Two Windings", details: error.message },
      { status: 500 }
    );
  }
}