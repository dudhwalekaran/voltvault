import { NextResponse } from "next/server";
import connect from "@/lib/db";
import SeriesFact from "@/models/seriesFact";
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
  console.log("=== POST /api/series-fact Started ===");
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set" },
        { status: Nab5 }
      );
    }

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

    let series;
    try {
      const body = await req.json();
      series = body.series?.trim();
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!series) {
      console.log("Missing series field");
      return NextResponse.json(
        { error: "Missing required field: series" },
        { status: 400 }
      );
    }

    await connect();
    console.log("DB Connected");

    // Log the schema to confirm
    console.log("SeriesFact Schema:", SeriesFact.schema.obj);

    const seriesFactStatus = decoded.status === "admin" ? "approved" : "pending";
    const newSeriesFact = new SeriesFact({
      series,
      status: seriesFactStatus,
    });

    try {
      const savedSeriesFact = await newSeriesFact.save();
      console.log("Series Fact Saved:", savedSeriesFact);
    } catch (error) {
      console.error("Failed to save Series Fact:", error.message, error.stack);
      return NextResponse.json(
        { error: "Failed to create Series Fact", details: error.message },
        { status: 400 }
      );
    }

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
      }
    } else {
      console.log("User is not admin, skipping history log");
    }

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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const status = url.searchParams.get("status");

    let query = {};
    if (decoded.status !== "admin") {
      query = { status: "approved" };
    }
    if (status) query.status = status;

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