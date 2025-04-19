import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import Lcc from "@/models/Lcc-hvdc-link";
import History from "@/models/History"; // Import History model for logging actions
import jwt from "jsonwebtoken";

// GET method (Fetch a single Lcc by ID)
export async function GET(req, { params }) {
  console.log("GET /api/lcc/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Lcc ID is missing");
    return NextResponse.json({ success: false, message: "Lcc ID is required" }, { status: 400 });
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

    const lcc = await Lcc.findById(id);
    if (!lcc) {
      console.log("Lcc not found for ID:", id);
      return NextResponse.json({ success: false, message: "Lcc not found" }, { status: 404 });
    }

    console.log("Lcc found:", lcc);
    return NextResponse.json({ success: true, lcc }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/lcc/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method (Update Lcc by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/lcc/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Lcc ID is missing");
    return NextResponse.json({ success: false, message: "Lcc ID is required" }, { status: 400 });
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

    const { lcc } = await req.json();
    if (!lcc) {
      console.log("Missing required field: lcc");
      return NextResponse.json({ success: false, message: "Missing required field: lcc is required" }, { status: 400 });
    }

    const existingLcc = await Lcc.findById(id);
    if (!existingLcc) {
      console.log("Lcc not found for ID:", id);
      return NextResponse.json({ success: false, message: "Lcc not found" }, { status: 404 });
    }

    const updatedLcc = await Lcc.findByIdAndUpdate(id, { lcc }, { new: true });

    // Compare old and new values to identify changes
    const changes = [];
    if (existingLcc.lcc !== lcc) {
      changes.push(`Changed lcc from "${existingLcc.lcc}" to "${lcc}"`);
    }

    // Log the update action to History with specific changes
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "Lcc",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Lcc: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
      // Do not fail the request if history logging fails; log the error and continue
    }

    console.log("Lcc updated:", updatedLcc);
    return NextResponse.json(
      { success: true, message: "Lcc updated successfully", lcc: updatedLcc },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/lcc/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update Lcc", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method (Delete Lcc by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/lcc/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Lcc ID is missing");
    return NextResponse.json({ success: false, message: "Lcc ID is required" }, { status: 400 });
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

    const deletedLcc = await Lcc.findByIdAndDelete(id);
    if (!deletedLcc) {
      console.log("Lcc not found for ID:", id);
      return NextResponse.json({ success: false, message: "Lcc not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "Lcc",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Lcc: ${JSON.stringify(deletedLcc)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
      // Do not fail the request if history logging fails; log the error and continue
    }

    console.log("Lcc deleted:", deletedLcc);
    return NextResponse.json({ success: true, message: "Lcc deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/lcc/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}