import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SingleLineDiagram from "@/models/SingleLineDiagram";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("=== POST /api/single-line-diagram Started ===");
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

    const { description, imageUrl } = body;
    if (!description || !imageUrl) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: description and imageUrl are required" },
        { status: 400 }
      );
    }

    // Connect DB
    await connectDB();
    console.log("DB Connected");

    // Direct save
    const singleLineDiagram = new SingleLineDiagram({
      description,
      imageUrl,
      status: decoded.status === "admin" ? "approved" : "pending",
      createdBy: decoded.userId,
    });
    const savedDiagram = await singleLineDiagram.save();
    console.log("Single Line Diagram Saved:", savedDiagram);

    // Log history for admins
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      const history = new History({
        action: "create",
        dataType: "SingleLineDiagram",
        recordId: savedDiagram._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created Single Line Diagram: ${JSON.stringify({ description, imageUrl })}`,
      });
      await history.save();
      console.log("History entry created:", history);
    } else {
      console.log("User is not admin, skipping history log");
    }

    // Return with 200
    const response = {
      success: true,
      message: "Single Line Diagram created successfully",
      singleLineDiagram: savedDiagram,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/single-line-diagram Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create Single Line Diagram", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  console.log("=== GET /api/single-line-diagram Started ===");
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

    await connectDB();
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

    const diagrams = await SingleLineDiagram.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await SingleLineDiagram.countDocuments(query);

    console.log(`Single Line Diagrams Fetched: ${diagrams.length} (Page ${page}, Total ${total})`);
    return NextResponse.json(
      {
        success: true,
        message: diagrams.length === 0 ? "No Single Line Diagrams found" : undefined,
        diagrams: diagrams || [],
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
    console.error("=== GET /api/single-line-diagram Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Single Line Diagrams", details: error.message },
      { status: 500 }
    );
  }
}