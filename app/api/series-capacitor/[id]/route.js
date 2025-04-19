import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import SeriesCapacitor from "@/models/seriesCapacitor"; // Corrected import name to match usage
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET method (Fetch a single Series Capacitor by ID)
export async function GET(req, { params }) {
  console.log("GET /api/series-capacitor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Series Capacitor ID is missing");
    return NextResponse.json({ success: false, message: "Series Capacitor ID is required" }, { status: 400 });
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

    const capacitor = await SeriesCapacitor.findById(id);
    if (!capacitor) {
      console.log("Series Capacitor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Series Capacitor not found" }, { status: 404 });
    }

    console.log("Series Capacitor found:", capacitor);
    return NextResponse.json({ success: true, seriesCapacitor: capacitor }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/series-capacitor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update Series Capacitor by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/series-capacitor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Series Capacitor ID is missing");
    return NextResponse.json({ success: false, message: "Series Capacitor ID is required" }, { status: 400 });
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

    const updates = await req.json();
    console.log("Received updates:", updates);

    const existingCapacitor = await SeriesCapacitor.findById(id);
    if (!existingCapacitor) {
      console.log("Series Capacitor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Series Capacitor not found" }, { status: 404 });
    }

    // Filter out undefined or empty values to prevent overwriting
    const filteredUpdates = {};
    for (const key in updates) {
      if (updates[key] !== undefined && updates[key] !== "") {
        filteredUpdates[key] = updates[key];
      }
    }

    // Compare old and new values to identify changes for history logging
    const changes = [];
    if (updates.location && existingCapacitor.location !== updates.location) {
      changes.push(`Changed location from "${existingCapacitor.location}" to "${updates.location}"`);
    }
    if (updates.mvar && existingCapacitor.mvar !== updates.mvar) {
      changes.push(`Changed mvar from "${existingCapacitor.mvar}" to "${updates.mvar}"`);
    }
    if (updates.compensation && existingCapacitor.compensation !== updates.compensation) {
      changes.push(`Changed compensation from "${existingCapacitor.compensation}" to "${updates.compensation}"`);
    }

    // Update only provided fields dynamically
    const updatedCapacitor = await SeriesCapacitor.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true }
    );

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "SeriesCapacitor",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Series Capacitor: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Series Capacitor updated:", updatedCapacitor);
    return NextResponse.json(
      { success: true, message: "Series Capacitor updated successfully", seriesCapacitor: updatedCapacitor },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/series-capacitor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to update Series Capacitor", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete Series Capacitor by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/series-capacitor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Series Capacitor ID is missing");
    return NextResponse.json({ success: false, message: "Series Capacitor ID is required" }, { status: 400 });
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

    const deletedCapacitor = await SeriesCapacitor.findByIdAndDelete(id);
    if (!deletedCapacitor) {
      console.log("Series Capacitor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Series Capacitor not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "SeriesCapacitor",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Series Capacitor: ${JSON.stringify(deletedCapacitor)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Series Capacitor deleted:", deletedCapacitor);
    return NextResponse.json(
      { success: true, message: "Series Capacitor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/series-capacitor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to delete Series Capacitor", details: error.message },
      { status: 500 }
    );
  }
}