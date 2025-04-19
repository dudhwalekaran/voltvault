import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import Turbine from "@/models/Turbine";
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET method (Fetch a single Turbine by ID)
export async function GET(req, { params }) {
  console.log("GET /api/turbine/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Turbine ID is missing");
    return NextResponse.json({ success: false, message: "Turbine ID is required" }, { status: 400 });
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

    const turbine = await Turbine.findById(id);
    if (!turbine) {
      console.log("Turbine not found for ID:", id);
      return NextResponse.json({ success: false, message: "Turbine not found" }, { status: 404 });
    }

    console.log("Turbine found:", turbine);
    return NextResponse.json({ success: true, turbine }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/turbine/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update Turbine by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/turbine/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Turbine ID is missing");
    return NextResponse.json({ success: false, message: "Turbine ID is required" }, { status: 400 });
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

    const { location, turbineType, deviceName, imageUrl } = await req.json();
    if (!location || !turbineType || !deviceName || !imageUrl) {
      console.log("Missing required fields");
      return NextResponse.json(
        { success: false, message: "Missing required fields: location, turbineType, deviceName, and imageUrl are required" },
        { status: 400 }
      );
    }

    const existingTurbine = await Turbine.findById(id);
    if (!existingTurbine) {
      console.log("Turbine not found for ID:", id);
      return NextResponse.json({ success: false, message: "Turbine not found" }, { status: 404 });
    }

    const updatedTurbine = await Turbine.findByIdAndUpdate(
      id,
      { location, turbineType, deviceName, imageUrl },
      { new: true }
    );

    // Compare old and new values to identify changes
    const changes = [];
    if (existingTurbine.location !== location) {
      changes.push(`Changed location from "${existingTurbine.location}" to "${location}"`);
    }
    if (existingTurbine.turbineType !== turbineType) {
      changes.push(`Changed turbineType from "${existingTurbine.turbineType}" to "${turbineType}"`);
    }
    if (existingTurbine.deviceName !== deviceName) {
      changes.push(`Changed deviceName from "${existingTurbine.deviceName}" to "${deviceName}"`);
    }
    if (existingTurbine.imageUrl !== imageUrl) {
      changes.push(`Changed imageUrl from "${existingTurbine.imageUrl}" to "${imageUrl}"`);
    }

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "Turbine",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Turbine: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Turbine updated:", updatedTurbine);
    return NextResponse.json(
      { success: true, message: "Turbine updated successfully", turbine: updatedTurbine },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/turbine/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update Turbine", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete Turbine by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/turbine/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Turbine ID is missing");
    return NextResponse.json({ success: false, message: "Turbine ID is required" }, { status: 400 });
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

    const deletedTurbine = await Turbine.findByIdAndDelete(id);
    if (!deletedTurbine) {
      console.log("Turbine not found for ID:", id);
      return NextResponse.json({ success: false, message: "Turbine not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "Turbine",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Turbine: ${JSON.stringify(deletedTurbine)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Turbine deleted:", deletedTurbine);
    return NextResponse.json({ success: true, message: "Turbine deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/turbine/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}