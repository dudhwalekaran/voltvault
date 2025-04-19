import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import ShuntReactor from "@/models/shuntReactor"; // Corrected import name to match usage
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET method (Fetch a single Shunt Reactor by ID)
export async function GET(req, { params }) {
  console.log("GET /api/shunt-reactor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt Reactor ID is missing");
    return NextResponse.json({ success: false, message: "Shunt Reactor ID is required" }, { status: 400 });
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

    const shunt = await ShuntReactor.findById(id);
    if (!shunt) {
      console.log("Shunt Reactor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt Reactor not found" }, { status: 404 });
    }

    console.log("Shunt Reactor found:", shunt);
    return NextResponse.json({ success: true, shuntReactor: shunt }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/shunt-reactor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update Shunt Reactor by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/shunt-reactor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt Reactor ID is missing");
    return NextResponse.json({ success: false, message: "Shunt Reactor ID is required" }, { status: 400 });
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

    const existingShunt = await ShuntReactor.findById(id);
    if (!existingShunt) {
      console.log("Shunt Reactor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt Reactor not found" }, { status: 404 });
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
    const updatedShunt = await ShuntReactor.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true }
    );

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "ShuntReactor",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Shunt Reactor: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Shunt Reactor updated:", updatedShunt);
    return NextResponse.json(
      { success: true, message: "Shunt Reactor updated successfully", shuntReactor: updatedShunt },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/shunt-reactor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to update Shunt Reactor", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete Shunt Reactor by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/shunt-reactor/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt Reactor ID is missing");
    return NextResponse.json({ success: false, message: "Shunt Reactor ID is required" }, { status: 400 });
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

    const deletedShunt = await ShuntReactor.findByIdAndDelete(id); // Fixed: Changed Capacitor to ShuntReactor
    if (!deletedShunt) {
      console.log("Shunt Reactor not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt Reactor not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "ShuntReactor",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Shunt Reactor: ${JSON.stringify(deletedShunt)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Shunt Reactor deleted:", deletedShunt);
    return NextResponse.json(
      { success: true, message: "Shunt Reactor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/shunt-reactor/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to delete Shunt Reactor", details: error.message },
      { status: 500 }
    );
  }
}