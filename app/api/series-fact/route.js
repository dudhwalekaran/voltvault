import { NextResponse } from "next/server";
import connect from "@/lib/db";
import SeriesFact from "@/models/seriesFact";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("=== POST /api/series-fact Started ===");
  try {
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: 500 }
      );
    }
    console.log("JWT_SECRET present");

    // Get and validate token
    const authHeader = req.headers.get("authorization");
    console.log("Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid token");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

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

    // Parse body with stricter validation
    let series;
    try {
      const body = await req.json();
      if (!body || typeof body !== "object") {
        throw new Error("Request body must be a valid JSON object");
      }
      series = body.series;
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body", details: error.message },
        { status: 400 }
      );
    }

    if (!series) {
      console.log("Missing series field");
      return NextResponse.json(
        { error: "Missing series field" },
        { status: 400 }
      );
    }

    // Connect to DB
    try {
      await connect();
      console.log("DB Connected");
    } catch (error) {
      console.error("DB Connection Failed:", error.message);
      return NextResponse.json(
        { error: "Database connection failed", details: error.message },
        { status: 500 }
      );
    }

    // Save Series Fact
    const seriesFactStatus = decoded.status === "admin" ? "approved" : "pending";
    const newSeriesFact = new SeriesFact({
      series,
      status: seriesFactStatus,
      createdBy: decoded.userId,
    });

    try {
      const savedSeriesFact = await newSeriesFact.save();
      console.log("Series Fact Saved:", savedSeriesFact);
    } catch (error) {
      console.error("Failed to save Series Fact:", error.message, error.stack);
      console.error("Validation Error Details:", JSON.stringify(error, null, 2));
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
        }));
        return NextResponse.json(
          { error: "Validation failed", details: validationErrors },
          { status: 400 }
        );
      }
      throw error; // Re-throw other errors to be caught by the outer catch
    }

    // Log history if user is admin
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      try {
        const history = new History({
          action: "create",
          dataType: "SeriesFact",
          recordId: newSeriesFact._id.toString(),
          adminEmail: decoded.email || decoded.userId || "Unknown",
          adminName: decoded.username || decoded.name || "Unknown",
          details: `Created Series Fact: ${JSON.stringify({ series })}`,
        });
        await history.save();
        console.log("History entry created:", history);
      } catch (historyError) {
        console.error("Failed to create history entry:", historyError.message);
        // Continue with success response despite history logging failure
      }
    } else {
      console.log("User is not admin, skipping history log");
    }

    // Success response with status 200
    const response = {
      success: true,
      message: decoded.status === "admin" ? "Series Fact created successfully" : "Series Fact submitted for approval",
      seriesFact: newSeriesFact,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/series-fact Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create Series Fact", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  console.log("=== GET /api/series-fact Started ===");
  try {
    const authHeader = req.headers.get("authorization");
    console.log("Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid token");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: "Invalid token", details: error.message },
        { status: 401 }
      );
    }

    await connect();
    console.log("DB Connected");

    // Extract query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const status = url.searchParams.get("status");

    // Build query
    let query = {};
    if (decoded.status !== "admin") {
      query = { $or: [{ createdBy: decoded.userId }, { status: "approved" }] };
    }
    if (status) query.status = status;

    // Fetch series facts with pagination and sorting
    const seriesFacts = await SeriesFact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await SeriesFact.countDocuments(query);

    console.log(`Series Facts Fetched: ${seriesFacts.length} (Page ${page}, Total ${total})`);
    return NextResponse.json(
      {
        success: true,
        seriesFacts: seriesFacts || [],
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
    console.error("=== GET /api/series-fact Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Series Facts", details: error.message },
      { status: 500 }
    );
  }
}