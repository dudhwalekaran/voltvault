import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lcc from "@/models/Lcc-hvdc-link";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    console.log("=== POST /api/lcc Started ===");

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
    let lcc;
    try {
      const body = await req.json();
      lcc = body.lcc;
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!lcc) {
      console.log("Missing lcc");
      return NextResponse.json({ error: "Missing lcc field" }, { status: 400 });
    }

    // Connect to DB
    try {
      await connectDB();
      console.log("DB Connected");
    } catch (error) {
      console.error("DB Connection Failed:", error.message);
      return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
    }

    // Save Lcc
    const lccStatus = decoded.status === "admin" ? "approved" : "pending";
    const newLcc = new Lcc({
      lcc,
      status: lccStatus,
      createdBy: decoded.userId,
    });

    const savedLcc = await newLcc.save();
    console.log("Lcc Saved:", savedLcc);

    // Log history if user is admin
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      const history = new History({
        action: "create",
        dataType: "Lcc",
        recordId: savedLcc._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created Lcc: ${JSON.stringify({ lcc })}`,
      });
      await history.save();
      console.log("History entry created:", history);
    } else {
      console.log("User is not admin, skipping history log");
    }

    // Success response
    const response = { success: true, message: "Lcc created successfully", lcc: savedLcc };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/lcc Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    console.log("=== GET /api/lcc Started ===");
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    await connectDB();
    const lccs = decoded.status === "admin"
      ? await Lcc.find()
      : await Lcc.find({ $or: [{ createdBy: decoded.userId }, { status: "approved" }] });

    console.log("Fetched Lccs:", lccs.length);
    return NextResponse.json({ lccs }, { status: 200 });

  } catch (error) {
    console.error("GET Failed:", error.message);
    return NextResponse.json({ error: "Failed to fetch Lccs", details: error.message }, { status: 500 });
  }
}