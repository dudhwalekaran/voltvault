import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import TransmissionLine from "@/models/transmissionLine";
import History from "@/models/History"; // Import History model for logging
import jwt from "jsonwebtoken";

// GET method - Retrieve a specific transmission line by ID
export async function GET(req, { params }) {
  const { id } = params; // Extract the ID from the dynamic route
  await connectionToDatabase();

  try {
    const transmissionLine = await TransmissionLine.findById(id);
    if (!transmissionLine) {
      return NextResponse.json(
        { success: false, message: "Transmission Line not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, transmissionLine },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method - Update a specific transmission line by ID
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
      return NextResponse.json(
        { error: "Unauthorized: Admins only" },
        { status: 403 }
      );
    }

    const data = await req.json();
    console.log("Received Data:", data);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const updatedTransmissionLine = await TransmissionLine.findByIdAndUpdate(
      id,
      { $set: data }, // Update only provided fields
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedTransmissionLine) {
      return NextResponse.json(
        { success: false, message: "Transmission Line not found" },
        { status: 404 }
      );
    }

    // Log the update action to History
    const history = new History({
      action: "update",
      dataType: "TransmissionLine",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Updated Transmission Line: ${JSON.stringify(data)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json(
      {
        success: true,
        message: "Transmission Line updated",
        transmissionLine: updatedTransmissionLine,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method - Delete a specific transmission line by ID
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
      return NextResponse.json(
        { error: "Unauthorized: Admins only" },
        { status: 403 }
      );
    }

    const deletedTransmissionLine = await TransmissionLine.findByIdAndDelete(id);
    if (!deletedTransmissionLine) {
      return NextResponse.json(
        { success: false, message: "Transmission Line not found" },
        { status: 404 }
      );
    }

    // Log the delete action to History
    const history = new History({
      action: "delete",
      dataType: "TransmissionLine",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Deleted Transmission Line: ${JSON.stringify(deletedTransmissionLine)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json(
      { success: true, message: "Transmission Line deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}