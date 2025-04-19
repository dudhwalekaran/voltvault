import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import SingleLineDiagram from "@/models/SingleLineDiagram";
import History from "@/models/History"; // Import History model
import jwt from "jsonwebtoken";

// GET (Fetch a single diagram by ID)
export async function GET(req, { params }) {
  console.log("GET /api/single-line-diagram/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Single Line Diagram ID is missing");
    return NextResponse.json({ success: false, message: "Single Line Diagram ID is required" }, { status: 400 });
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

    const diagram = await SingleLineDiagram.findById(id);
    if (!diagram) {
      console.log("Single Line Diagram not found for ID:", id);
      return NextResponse.json({ success: false, message: "Single Line Diagram not found" }, { status: 404 });
    }

    console.log("Single Line Diagram found:", diagram);
    return NextResponse.json({ success: true, singleLineDiagram: diagram }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/single-line-diagram/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT (Update diagram by ID)
export async function PUT(req, { params }) {
  console.log("PUT /api/single-line-diagram/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Single Line Diagram ID is missing");
    return NextResponse.json({ success: false, message: "Single Line Diagram ID is required" }, { status: 400 });
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

    const { description, imageUrl } = await req.json();
    if (!description || !imageUrl) {
      console.log("Missing required fields");
      return NextResponse.json(
        { success: false, message: "Missing required fields: description and imageUrl are required" },
        { status: 400 }
      );
    }

    const existingDiagram = await SingleLineDiagram.findById(id);
    if (!existingDiagram) {
      console.log("Single Line Diagram not found for ID:", id);
      return NextResponse.json({ success: false, message: "Single Line Diagram not found" }, { status: 404 });
    }

    const updatedDiagram = await SingleLineDiagram.findByIdAndUpdate(
      id,
      { description, imageUrl },
      { new: true }
    );

    // Compare old and new values to identify changes
    const changes = [];
    if (existingDiagram.description !== description) {
      changes.push(`Changed description from "${existingDiagram.description}" to "${description}"`);
    }
    if (existingDiagram.imageUrl !== imageUrl) {
      changes.push(`Changed imageUrl from "${existingDiagram.imageUrl}" to "${imageUrl}"`);
    }

    // Log the update action to History
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    try {
      const history = new History({
        action: "update",
        dataType: "SingleLineDiagram",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Updated Single Line Diagram: ${details}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Single Line Diagram updated:", updatedDiagram);
    return NextResponse.json(
      { success: true, message: "Single Line Diagram updated successfully", singleLineDiagram: updatedDiagram },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/single-line-diagram/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to update Single Line Diagram", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE (Remove diagram by ID)
export async function DELETE(req, { params }) {
  console.log("DELETE /api/single-line-diagram/[id] called with params:", params);

  const { id } = params || {};
  if (!id) {
    console.log("Single Line Diagram ID is missing");
    return NextResponse.json({ success: false, message: "Single Line Diagram ID is required" }, { status: 400 });
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

    const deletedDiagram = await SingleLineDiagram.findByIdAndDelete(id);
    if (!deletedDiagram) {
      console.log("Single Line Diagram not found for ID:", id);
      return NextResponse.json({ success: false, message: "Single Line Diagram not found" }, { status: 404 });
    }

    // Log the delete action to History
    try {
      const history = new History({
        action: "delete",
        dataType: "SingleLineDiagram",
        recordId: id,
        adminEmail: decoded.email || decoded.userId || "Unknown",
        adminName: decoded.username || decoded.name || "Unknown",
        details: `Deleted Single Line Diagram: ${JSON.stringify(deletedDiagram)}`,
      });
      await history.save();
      console.log("History entry created successfully:", history);
    } catch (historyError) {
      console.error("Failed to create history entry:", historyError.message);
    }

    console.log("Single Line Diagram deleted:", deletedDiagram);
    return NextResponse.json(
      { success: true, message: "Single Line Diagram deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/single-line-diagram/[id]:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to delete Single Line Diagram", details: error.message },
      { status: 500 }
    );
  }
}