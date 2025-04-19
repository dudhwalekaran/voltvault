import connectionToDatabase from "@/lib/db";
import ShuntFact from "@/models/shuntFact";
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }});
}

// GET method (Fetch a single Shunt by ID)
export async function GET(req, { params }) {
  console.log("GET /api/shunt-fact/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt ID is missing");
    return NextResponse.json({ success: false, message: "Shunt ID is required" }, { status: 400 });
  }

  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const shunt = await ShuntFact.findById(id);
    if (!shunt) {
      console.log("Shunt not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt not found" }, { status: 404 });
    }

    console.log("Shunt found:", shunt);
    return NextResponse.json({ success: true, shunt }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/shunt-fact/[id]:", error);
    return NextResponse.json({ success: false, message: "Server error", details: error.message }, { status: 500 });
  }
}

// PUT method (Update Shunt by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/shunt-fact/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt ID is missing");
    return NextResponse.json({ success: false, message: "Shunt ID is required" }, { status: 400 });
  }

  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    if (decoded.status !== "admin") {
      console.log("Unauthorized: Admins only");
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 403 });
    }

    const { shunt } = await req.json();
    if (!shunt) {
      console.log("Missing required field: shunt");
      return NextResponse.json({ success: false, message: "Shunt field is required" }, { status: 400 });
    }

    const existingShuntFact = await ShuntFact.findById(id);
    if (!existingShuntFact) {
      console.log("Shunt not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt not found" }, { status: 404 });
    }

    const updatedShuntFact = await ShuntFact.findByIdAndUpdate(id, { shunt }, { new: true });

    // Log changes to History
    const changes = existingShuntFact.shunt !== shunt ? `Changed shunt from "${existingShuntFact.shunt}" to "${shunt}"` : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "ShuntFact",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated ShuntFact: ${changes}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Shunt updated:", updatedShuntFact);
    return NextResponse.json(
      { success: true, message: "Shunt updated successfully", shunt: updatedShuntFact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/shunt-fact/[id]:", error);
    return NextResponse.json({ success: false, message: "Failed to update Shunt", details: error.message }, { status: 500 });
  }
}

// DELETE method (Delete Shunt by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/shunt-fact/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Shunt ID is missing");
    return NextResponse.json({ success: false, message: "Shunt ID is required" }, { status: 400 });
  }

  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    if (decoded.status !== "admin") {
      console.log("Unauthorized: Admins only");
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 403 });
    }

    const deletedShuntFact = await ShuntFact.findByIdAndDelete(id);
    if (!deletedShuntFact) {
      console.log("Shunt not found for ID:", id);
      return NextResponse.json({ success: false, message: "Shunt not found" }, { status: 404 });
    }

    // Log delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "ShuntFact",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted ShuntFact: ${JSON.stringify(deletedShuntFact)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Shunt deleted:", deletedShuntFact);
    return NextResponse.json({ success: true, message: "Shunt deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/shunt-fact/[id]:", error);
    return NextResponse.json({ success: false, message: "Server error", details: error.message }, { status: 500 });
  }
}