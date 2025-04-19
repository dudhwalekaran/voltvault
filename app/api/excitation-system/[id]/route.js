import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ExcitationSystem from "@/models/ExcitationSystem";
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET (Fetch a single Excitation System by ID)
export async function GET(req, { params }) {
  console.log("GET /api/excitation-system/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Excitation System ID is missing");
    return NextResponse.json({ success: false, message: "Excitation System ID is required" }, { status: 400 });
  }

  await connectDB();

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

    const excitation = await ExcitationSystem.findById(id);
    if (!excitation) {
      console.log("Excitation System not found for ID:", id);
      return NextResponse.json({ success: false, message: "Excitation System not found" }, { status: 404 });
    }

    console.log("Excitation System found:", excitation);
    return NextResponse.json({ success: true, excitationSystem: excitation }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Excitation System:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT (Update Excitation System by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/excitation-system/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Excitation System ID is missing");
    return NextResponse.json({ success: false, message: "Excitation System ID is required" }, { status: 400 });
  }

  await connectDB();

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

    const { 
      location, 
      avrType, 
      generatorDeviceName, 
      avrImageUrl, 
      pssImageUrl, 
      uelImageUrl, 
      oelImageUrl 
    } = await req.json();
    console.log("Received updates:", { location, avrType, generatorDeviceName, avrImageUrl, pssImageUrl, uelImageUrl, oelImageUrl });

    const existingExcitation = await ExcitationSystem.findById(id);
    if (!existingExcitation) {
      console.log("Excitation System not found for ID:", id);
      return NextResponse.json({ success: false, message: "Excitation System not found" }, { status: 404 });
    }

    // Compare old and new values to identify changes for history logging
    const changes = [];
    if (location && existingExcitation.location !== location) {
      changes.push(`Changed location from "${existingExcitation.location}" to "${location}"`);
    }
    if (avrType && existingExcitation.avrType !== avrType) {
      changes.push(`Changed avrType from "${existingExcitation.avrType}" to "${avrType}"`);
    }
    if (generatorDeviceName && existingExcitation.generatorDeviceName !== generatorDeviceName) {
      changes.push(`Changed generatorDeviceName from "${existingExcitation.generatorDeviceName}" to "${generatorDeviceName}"`);
    }
    if (avrImageUrl && existingExcitation.avrImageUrl !== avrImageUrl) {
      changes.push(`Changed avrImageUrl from "${existingExcitation.avrImageUrl}" to "${avrImageUrl}"`);
    }
    if (pssImageUrl && existingExcitation.pssImageUrl !== pssImageUrl) {
      changes.push(`Changed pssImageUrl from "${existingExcitation.pssImageUrl}" to "${pssImageUrl}"`);
    }
    if (uelImageUrl && existingExcitation.uelImageUrl !== uelImageUrl) {
      changes.push(`Changed uelImageUrl from "${existingExcitation.uelImageUrl}" to "${uelImageUrl}"`);
    }
    if (oelImageUrl && existingExcitation.oelImageUrl !== oelImageUrl) {
      changes.push(`Changed oelImageUrl from "${existingExcitation.oelImageUrl}" to "${oelImageUrl}"`);
    }

    // Update the Excitation System with the provided fields
    const updatedExcitation = await ExcitationSystem.findByIdAndUpdate(
      id,
      { 
        location, 
        avrType, 
        generatorDeviceName, 
        avrImageUrl, 
        pssImageUrl, 
        uelImageUrl, 
        oelImageUrl 
      },
      { new: true }
    );

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "ExcitationSystem",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Excitation System: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Excitation System updated:", updatedExcitation);
    return NextResponse.json(
      { success: true, message: "Excitation System updated", excitationSystem: updatedExcitation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Excitation System:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE (Remove Excitation System by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/excitation-system/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Excitation System ID is missing");
    return NextResponse.json({ success: false, message: "Excitation System ID is required" }, { status: 400 });
  }

  await connectDB();

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

    const deletedExcitation = await ExcitationSystem.findByIdAndDelete(id);
    if (!deletedExcitation) {
      console.log("Excitation System not found for ID:", id);
      return NextResponse.json({ success: false, message: "Excitation System not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "ExcitationSystem",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Excitation System: ${JSON.stringify(deletedExcitation)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Excitation System deleted:", deletedExcitation);
    return NextResponse.json(
      { success: true, message: "Excitation System deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Excitation System:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Delete failed", details: error.message },
      { status: 500 }
    );
  }
}