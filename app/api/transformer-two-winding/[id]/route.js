import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import TransformersTwoWinding from "@/models/transformer-two-winding"; // Corrected model import
import History from "@/models/History"; // Import History model for logging
import jwt from "jsonwebtoken";

// GET method - Retrieve a specific transformer by ID
export async function GET(req, { params }) {
  const { id } = params; // Extract the ID from the dynamic route
  await connectionToDatabase();

  try {
    const transformer = await TransformersTwoWinding.findById(id);
    if (!transformer) {
      return NextResponse.json({ success: false, message: "Winding not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transformer }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method - Update a specific transformer by ID
export async function PUT(req, { params }) {
  const { id } = params; // Extract the ID from the dynamic route
  await connectionToDatabase();

  try {
    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const body = await req.json(); // Parse the incoming request body
    const updatedTransformer = await TransformersTwoWinding.findByIdAndUpdate(
      id,
      { $set: body }, // Update only the fields provided in the body
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedTransformer) {
      return NextResponse.json({ success: false, message: "Winding not found" }, { status: 404 });
    }

    // Log the update action to History
    const history = new History({
      action: "update",
      dataType: "TransformersTwoWinding",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Updated Transformer: ${JSON.stringify(body)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json({ success: true, data: updatedTransformer }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method - Delete a specific transformer by ID
export async function DELETE(req, { params }) {
  const { id } = params; // Extract the ID from the dynamic route
  await connectionToDatabase();

  try {
    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const deletedTransformer = await TransformersTwoWinding.findByIdAndDelete(id);
    if (!deletedTransformer) {
      return NextResponse.json({ success: false, message: "Winding not found" }, { status: 404 });
    }

    // Log the delete action to History
    const history = new History({
      action: "delete",
      dataType: "TransformersTwoWinding",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Deleted Transformer: ${JSON.stringify(deletedTransformer)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json({ success: true, message: "Winding deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}