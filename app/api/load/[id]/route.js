import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import Load from "@/models/Load";
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET method (Fetch a single Load by ID)
export async function GET(req, { params }) {
  console.log("GET /api/load/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Load ID is missing");
    return NextResponse.json({ success: false, message: "Load ID is required" }, { status: 400 });
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

    const load = await Load.findById(id);
    if (!load) {
      console.log("Load not found for ID:", id);
      return NextResponse.json({ success: false, message: "Load not found" }, { status: 404 });
    }

    console.log("Load found:", load);
    return NextResponse.json({ success: true, load }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/load/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update Load by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/load/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Load ID is missing");
    return NextResponse.json({ success: false, message: "Load ID is required" }, { status: 400 });
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

    const existingLoad = await Load.findById(id);
    if (!existingLoad) {
      console.log("Load not found for ID:", id);
      return NextResponse.json({ success: false, message: "Load not found" }, { status: 404 });
    }

    // Compare old and new values to identify changes for history logging
    const changes = [];
    if (updates.location && existingLoad.location !== updates.location) {
      changes.push(`Changed location from "${existingLoad.location}" to "${updates.location}"`);
    }
    if (updates.circuitBreaker !== undefined && existingLoad.circuitBreaker !== updates.circuitBreaker) {
      changes.push(`Changed circuitBreaker from "${existingLoad.circuitBreaker}" to "${updates.circuitBreaker}"`);
    }
    if (updates.busFrom && existingLoad.busFrom !== updates.busFrom) {
      changes.push(`Changed busFrom from "${existingLoad.busFrom}" to "${updates.busFrom}"`);
    }
    if (updates.busSectionFrom && existingLoad.busSectionFrom !== updates.busSectionFrom) {
      changes.push(`Changed busSectionFrom from "${existingLoad.busSectionFrom}" to "${updates.busSectionFrom}"`);
    }
    if (updates.pmw && existingLoad.pmw !== updates.pmw) {
      changes.push(`Changed pmw from "${existingLoad.pmw}" to "${updates.pmw}"`);
    }
    if (updates.qmvar && existingLoad.qmvar !== updates.qmvar) {
      changes.push(`Changed qmvar from "${existingLoad.qmvar}" to "${updates.qmvar}"`);
    }

    // Update the load with the provided fields
    const updatedLoad = await Load.findByIdAndUpdate(id, { $set: updates }, { new: true });

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "Load",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Load: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Load updated:", updatedLoad);
    return NextResponse.json(
      { success: true, message: "Load updated successfully", load: updatedLoad },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/load/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to update Load", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete Load by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/load/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Load ID is missing");
    return NextResponse.json({ success: false, message: "Load ID is required" }, { status: 400 });
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

    const deletedLoad = await Load.findByIdAndDelete(id);
    if (!deletedLoad) {
      console.log("Load not found for ID:", id);
      return NextResponse.json({ success: false, message: "Load not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "Load",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Load: ${JSON.stringify(deletedLoad)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Load deleted:", deletedLoad);
    return NextResponse.json(
      { success: true, message: "Load deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/load/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to delete Load", details: error.message },
      { status: 500 }
    );
  }
}