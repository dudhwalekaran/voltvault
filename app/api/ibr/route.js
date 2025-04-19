import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Ibr from "@/models/Ibr";
import PendingRequest from "@/models/PendingRequest";
import History from "@/models/History";
import jwt from "jsonwebtoken";

// POST method to create a new IBR
export async function POST(req) {
  try {
    console.log("=== POST /api/ibr Started ===");

    // Check JWT_SECRET early
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
    let ibr;
    try {
      const body = await req.json();
      ibr = body.ibr;
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body", details: error.message },
        { status: 400 }
      );
    }

    if (!ibr) {
      console.log("Missing ibr field");
      return NextResponse.json({ error: "Missing ibr field" }, { status: 400 });
    }

    // Connect to DB
    await connect();
    console.log("Database connected successfully");

    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    console.log("User role:", role);

    if (role === "admin") {
      console.log("Admin role detected, creating IBR directly");
      const newIbr = new Ibr({ ibr });
      const savedIbr = await newIbr.save();
      console.log("IBR saved directly:", savedIbr);

      // Log the action to History
      const history = new History({
        action: "create",
        dataType: "IBR",
        recordId: savedIbr._id.toString(),
        adminEmail: decoded.email || "unknown",
        adminName: decoded.username || decoded.name || "unknown",
        details: `Created IBR: ${JSON.stringify({ ibr })}`,
      });
      await history.save();
      console.log("History entry created:", history);

      const response = {
        success: true,
        message: "IBR created successfully",
        ibr: savedIbr,
      };
      console.log("Sending Response:", response);
      return NextResponse.json(response, { status: 201 });
    }

    console.log("Non-admin role detected, saving IBR to PendingRequest");
    const pendingRequest = new PendingRequest({
      dataType: "IBR",
      data: { ibr },
      submittedBy: decoded.userId || decoded.email || "unknown",
      username: decoded.username || decoded.name || "unknown",
      email: decoded.email || "unknown",
      description: `Add IBR: ${ibr}`,
      status: "pending",
    });
    const savedPendingRequest = await pendingRequest.save();
    console.log("PendingRequest saved:", savedPendingRequest);

    const response = {
      success: true,
      message: "IBR request submitted for approval",
      pendingRequest: savedPendingRequest,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("=== POST /api/ibr Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Submission failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch IBRs with authorization
export async function GET(req) {
  try {
    console.log("=== GET /api/ibr Started ===");

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
        { error: "Invalid token", details: error.message },
        { status: 401 }
      );
    }

    // Connect to DB
    await connect();
    console.log("Database connected successfully");

    // Fetch IBRs based on role
    const ibrs = decoded.status === "admin"
      ? await Ibr.find()
      : await Ibr.find({ submittedBy: decoded.userId });

    console.log("Fetched IBRs:", ibrs.length);
    if (!ibrs || ibrs.length === 0) {
      console.log("No IBRs found for this user");
      return NextResponse.json(
        { success: true, message: "No IBRs found", ibrs: [] },
        { status: 200 }
      );
    }

    const response = { success: true, ibrs };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== GET /api/ibr Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch IBRs", details: error.message },
      { status: 500 }
    );
  }
}