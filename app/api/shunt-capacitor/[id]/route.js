import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import ShuntCapacitor from "@/models/shuntCapacitor"; // Corrected import name to match usage
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET method (Fetch a single Shunt Capacitor by ID)
export async function GET(req, { params }) {
  console.log("GET /api/shunt-capacitor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt Capacitor ID is missing");
    return NextResponse.json({ success: false, message: "Shunt Capacitor ID is required" }, { status: 400 });
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

    const shunt = await ShuntCapacitor.findById(id);
    if (!shunt) {
      console.log("Shunt Capacitor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt Capacitor not found" }, { status: 404 });
    }

    console.log("Shunt Capacitor found:", shunt);
    return NextResponse.json({ success: true, shuntCapacitor: shunt }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/shunt-capacitor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update Shunt Capacitor by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/shunt-capacitor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt Capacitor ID is missing");
    return NextResponse.json({ success: false, message: "Shunt Capacitor ID is required" }, { status: 400 });
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

    const existingShunt = await ShuntCapacitor.findById(id);
    if (!existingShunt) {
      console.log("Shunt Capacitor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt Capacitor not found" }, { status: 404 });
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
    if (updates.location && existingShunt.location !== updates.location) {
      changes.push(`Changed location from "${existingShunt.location}" to "${updates.location}"`);
    }
    if (updates.circuitBreaker !== undefined && existingShunt.circuitBreaker !== updates.circuitBreaker) {
      changes.push(`Changed circuitBreaker from "${existingShunt.circuitBreaker}" to "${updates.circuitBreaker}"`);
    }
    if (updates.busFrom && existingShunt.busFrom !== updates.busFrom) {
      changes.push(`Changed busFrom from "${existingShunt.busFrom}" to "${updates.busFrom}"`);
    }
    if (updates.busSectionFrom && existingShunt.busSectionFrom !== updates.busSectionFrom) {
      changes.push(`Changed busSectionFrom from "${existingShunt.busSectionFrom}" to "${updates.busSectionFrom}"`);
    }
    if (updates.kv && existingShunt.kv !== updates.kv) {
      changes.push(`Changed kv from "${existingShunt.kv}" to "${updates.kv}"`);
    }
    if (updates.mva && existingShunt.mva !== updates.mva) {
      changes.push(`Changed mva from "${existingShunt.mva}" to "${updates.mva}"`);
    }

    // Update only provided fields dynamically
    const updatedShunt = await ShuntCapacitor.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true }
    );

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "ShuntCapacitor",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Shunt Capacitor: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Shunt Capacitor updated:", updatedShunt);
    return NextResponse.json(
      { success: true, message: "Shunt Capacitor updated successfully", shuntCapacitor: updatedShunt },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/shunt-capacitor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to update Shunt Capacitor", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete Shunt Capacitor by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/shunt-capacitor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt Capacitor ID is missing");
    return NextResponse.json({ success: false, message: "Shunt Capacitor ID is required" }, { status: 400 });
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

    const deletedShunt = await ShuntCapacitor.findByIdAndDelete(id); // Fixed: Changed Capacitor to ShuntCapacitor
    if (!deletedShunt) {
      console.log("Shunt Capacitor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt Capacitor not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "ShuntCapacitor",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Shunt Capacitor: ${JSON.stringify(deletedShunt)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Shunt Capacitor deleted:", deletedShunt);
    return NextResponse.json(
      { success: true, message: "Shunt Capacitor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/shunt-capacitor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to delete Shunt Capacitor", details: error.message },
      { status: 500 }
    );
  }
}