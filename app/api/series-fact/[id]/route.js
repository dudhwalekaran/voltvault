import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import SeriesFact from "@/models/seriesFact"; // Renamed Series to SeriesFact for clarity
import History from "@/models/History"; // Import History model for logging actions
import jwt from "jsonwebtoken";

// GET method (Fetch a single SeriesFact by ID)
export async function GET(req, { params }) {
  console.log("GET /api/series-fact/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("SeriesFact ID is missing");
    return NextResponse.json({ success: false, message: "SeriesFact ID is required" }, { status: 400 });
  }

  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing or invalid Authorization header" },
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
        { success: false, message: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

    const seriesFact = await SeriesFact.findById(id);
    if (!seriesFact) {
      console.log("SeriesFact not found for ID:", id);
      return NextResponse.json({ success: false, message: "SeriesFact not found" }, { status: 404 });
    }

    console.log("SeriesFact found:", seriesFact);
    return NextResponse.json({ success: true, series: seriesFact }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/series-fact/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update SeriesFact by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/series-fact/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("SeriesFact ID is missing");
    return NextResponse.json({ success: false, message: "SeriesFact ID is required" }, { status: 400 });
  }

  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing or invalid Authorization header" },
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
        { success: false, message: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

    if (decoded.status !== "admin") {
      console.log("Unauthorized: Admins only");
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 403 });
    }

    const { series } = await req.json();
    if (!series) {
      console.log("Missing required field: series");
      return NextResponse.json({ success: false, message: "Missing required field: series is required" }, { status: 400 });
    }

    const existingSeriesFact = await SeriesFact.findById(id);
    if (!existingSeriesFact) {
      console.log("SeriesFact not found for ID:", id);
      return NextResponse.json({ success: false, message: "SeriesFact not found" }, { status: 404 });
    }

    const updatedSeriesFact = await SeriesFact.findByIdAndUpdate(id, { series }, { new: true });

    // Compare old and new values to identify changes
    const changes = [];
    if (existingSeriesFact.series !== series) {
      changes.push(`Changed series from "${existingSeriesFact.series}" to "${series}"`);
    }

    // Log the update action to History with specific changes
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "SeriesFact",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Series Fact: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
      // Do not fail the request if history logging fails; log the error and continue
    }

    console.log("SeriesFact updated:", updatedSeriesFact);
    return NextResponse.json(
      { success: true, message: "SeriesFact updated successfully", series: updatedSeriesFact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/series-fact/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update SeriesFact", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete SeriesFact by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/series-fact/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("SeriesFact ID is missing");
    return NextResponse.json({ success: false, message: "SeriesFact ID is required" }, { status: 400 });
  }

  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing or invalid Authorization header" },
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
        { success: false, message: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

    if (decoded.status !== "admin") {
      console.log("Unauthorized: Admins only");
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 403 });
    }

    const deletedSeriesFact = await SeriesFact.findByIdAndDelete(id);
    if (!deletedSeriesFact) {
      console.log("SeriesFact not found for ID:", id);
      return NextResponse.json({ success: false, message: "SeriesFact not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "SeriesFact",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Series Fact: ${JSON.stringify(deletedSeriesFact)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
      // Do not fail the request if history logging fails; log the error and continue
    }

    console.log("SeriesFact deleted:", deletedSeriesFact);
    return NextResponse.json({ success: true, message: "SeriesFact deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/series-fact/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}