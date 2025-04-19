import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Vsc from "@/models/Vsc-hvdc-link";
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
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // Get and validate token
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
    let vscFact;
    try {
      const body = await req.json();
      vscFact = body.vscFact;
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!vscFact) {
      console.log("Missing vscFact");
      return NextResponse.json({ error: "Missing vscFact" }, { status: 400 });
    }

    // Connect to DB
    try {
      await connectDB();
      console.log("DB Connected");
    } catch (error) {
      console.error("DB Connection Failed:", error.message);
      return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
    }

    // Save VSC
    const vscStatus = decoded.status === "admin" ? "approved" : "pending";
    const newVsc = new Vsc({
      vsc: vscFact,
      status: vscStatus,
      createdBy: decoded.userId,
    });

    const savedVsc = await newVsc.save();
    console.log("VSC Saved:", savedVsc);

    // Log history if user is admin (mirroring PUT/DELETE)
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      const history = new History({
        action: "create",
        dataType: "Vsc",
        recordId: savedVsc._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created VSC: ${JSON.stringify({ vsc: vscFact })}`,
      });
      await history.save();
      console.log("History entry created:", history);
    } else {
      console.log("User is not admin, skipping history log");
    }

    // Success response
    const response = { success: true, vsc: savedVsc };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/vsc Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET handler (unchanged)
export async function GET(req) {
  try {
    console.log("=== GET /api/vsc Started ===");
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Failed to fetch VSCs", details: error.message }, { status: 500 });
  }
}