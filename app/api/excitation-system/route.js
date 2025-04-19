import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ExcitationSystem from "@/models/ExcitationSystem";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("=== POST /api/excitation-system Started ===");
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
      console.log("Request Body:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { location, avr, generator, pssImageUrl, avrImageUrl, extraImage1Url, extraImage2Url } = body;
    if (!location || !avrImageUrl) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: location and avrImageUrl are required" },
        { status: 400 }
      );
    }

    // Connect DB
    await connectDB();
    console.log("DB Connected");

    // Create Excitation System directly
    const excitationSystem = new ExcitationSystem({
      location,
      avrType: avr,
      generatorDeviceName: generator,
      pssImageUrl,
      avrImageUrl,
      oelImageUrl: extraImage2Url,
      uelImageUrl: extraImage1Url,
      status: decoded.status === "admin" ? "approved" : "pending",
      createdBy: decoded.userId,
    });
    const savedExcitationSystem = await excitationSystem.save();
    console.log("Excitation System Saved:", savedExcitationSystem);

    // Log history for admins
    if (decoded.status === "admin") {
      console.log("User is admin, logging history...");
      const history = new History({
        action: "create",
        dataType: "ExcitationSystem",
        recordId: savedExcitationSystem._id.toString(),
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Created Excitation System: ${JSON.stringify({
          location,
          avrType: avr,
          generatorDeviceName: generator,
          pssImageUrl,
          avrImageUrl,
          oelImageUrl: extraImage2Url,
          uelImageUrl: extraImage1Url,
        })}`,
      });
      await history.save();
      console.log("History entry created:", history);
    } else {
      console.log("User is not admin, skipping history log");
    }

    // Return 200 status
    const response = {
      success: true,
      message: "Excitation System created successfully",
      excitationSystem: savedExcitationSystem,
    };
    console.log("Sending Response:", response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("=== POST /api/excitation-system Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to save Excitation System", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  console.log("=== GET /api/excitation-system Started ===");
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

    if (params?.id) {
      const excitation = await ExcitationSystem.findById(params.id);
      console.log("Excitation System Found:", excitation);
      return NextResponse.json(
        { success: true, excitationSystem: excitation || null },
        { status: 200 }
      );
    } else {
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

      const excitationSystems = await ExcitationSystem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await ExcitationSystem.countDocuments(query);

      console.log(`Excitation Systems Fetched: ${excitationSystems.length}`);
      return NextResponse.json(
        {
          success: true,
          excitationSystems: excitationSystems || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("=== GET /api/excitation-system Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch Excitation Systems", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  console.log("=== DELETE /api/excitation-system Started ===");
  try {
    const id = params?.id;
    if (!id) {
      console.log("Missing ID");
      return NextResponse.json({ error: "Excitation System ID is required" }, { status: 400 });
    }

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

    if (decoded.status !== "admin") {
      console.log("Unauthorized: Admins only");
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    await connectDB();
    console.log("DB Connected");

    const deletedExcitation = await ExcitationSystem.findByIdAndDelete(id);
    if (!deletedExcitation) {
      console.log("Excitation System not found");
      return NextResponse.json({ success: true, message: "Excitation System not found" }, { status: 200 });
    }

    console.log("Excitation System Deleted:", deletedExcitation);
    const history = new History({
      action: "delete",
      dataType: "ExcitationSystem",
      recordId: id,
      adminEmail: decoded.email || decoded.userId || "Unknown",
      adminName: decoded.username || decoded.name || "Unknown",
      details: `Deleted Excitation System: ${JSON.stringify(deletedExcitation)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json(
      { success: true, message: "Excitation System deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("=== DELETE /api/excitation-system Failed ===", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to delete Excitation System", details: error.message },
      { status: 500 }
    );
  }
}