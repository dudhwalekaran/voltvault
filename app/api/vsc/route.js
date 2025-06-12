import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Vsc from "@/models/Vsc";
import PendingRequest from "@/models/PendingRequest";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    console.log("=== POST /api/vsc Started ===");
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }

    // Get and validate token
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
        { error: "Invalid token", details: error.message },
        { status: 401 }
      );
    }

    // Parse body
    let vscFact;
    try {
      const body = await req.json();
      vscFact = body.vscFact;
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!vscFact) {
      console.log("Missing vscFact");
      return NextResponse.json({ error: "Missing vscFact" }, { status: 400 });
    }

    // Connect to DB
    await connectDB();
    console.log("Database connected successfully");

    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    console.log("User role:", role);

    if (role === "admin") {
      console.log("Admin role detected, creating VSC directly");
      const newVsc = new Vsc({
        vsc: vscFact,
        createdBy: decoded.userId,
      });
      const savedVsc = await newVsc.save();
      console.log("VSC saved directly:", savedVsc);

      // Log the action to History
      const history = new History({
        action: "create",
        dataType: "Vsc",
        recordId: savedVsc._id.toString(),
        adminEmail: decoded.email || decoded.userId || "unknown",
        adminName: decoded.username || decoded.name || "unknown",
        details: `Created VSC: ${JSON.stringify({ vsc: vscFact })}`,
      });
      await history.save(); // Fixed: Use instance to save
      console.log("History entry created:", history);

      const response = {
        success: true,
        message: "VSC created successfully",
        vsc: savedVsc,
      };
      console.log("Sending Response:", response);
      return NextResponse.json(response, { status: 201 });
    }

    console.log("Non-admin role detected, saving VSC to PendingRequest");
    const pendingRequest = new PendingRequest({
      dataType: "Vsc",
      data: { vsc: vscFact },
      submittedBy: decoded.userId || decoded.email || "unknown",
      username: decoded.username || decoded.name || "unknown",
      email: decoded.email || "unknown",
      description: `Add VSC: ${vscFact}`,
      status: "pending",
    });
    const savedPendingRequest = await pendingRequest.save();
    console.log("PendingRequest saved:", savedPendingRequest);

    const response = {
      success: true,
      message: "VSC request submitted for approval",
      pendingRequest: savedPendingRequest,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("=== POST /api/vsc Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    console.log("=== GET /api/vsc Started ===");
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.log("No authorization header provided, likely a browser visit");
      return NextResponse.json(
        { error: "This endpoint requires authentication. Please log in to access VSC data." },
        { status: 401 }
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Invalid authorization header format");
      return NextResponse.json(
        { error: "Unauthorized: Invalid token format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    await connectDB();
    const vscs = decoded.status === "admin"
      ? await Vsc.find()
      : await Vsc.find({ $or: [{ createdBy: decoded.userId }, { status: "approved" }] });

    console.log("Fetched VSCs:", vscs.length);
    return NextResponse.json({ vscs }, { status: 200 });
  } catch (error) {
    console.error("GET Failed:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch VSCs", details: error.message },
      { status: 500 }
    );
  }
}
