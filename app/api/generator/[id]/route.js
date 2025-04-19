import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import Generator from "@/models/Generator";
import History from "@/models/History"; // Import History model for logging
import jwt from "jsonwebtoken";

// GET method to fetch a single generator by ID
export async function GET(req, { params }) {
  const { id } = params;
  await connectionToDatabase();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const generator = await Generator.findById(id);
    if (!generator) {
      return NextResponse.json(
        { success: false, message: "Generator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, generator },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/generator/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method to update a generator by ID
export async function PUT(req, { params }) {
  const { id } = params;
  await connectionToDatabase();

  try {
    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    if (decoded.status !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admins only" },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("Received data:", body);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const updatedGenerator = await Generator.findByIdAndUpdate(
      id,
      { $set: body }, // Update all provided fields
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedGenerator) {
      return NextResponse.json(
        { success: false, message: "Generator not found" },
        { status: 404 }
      );
    }

    // Log the update action to History
    const history = new History({
      action: "update",
      dataType: "Generator",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Updated Generator: ${JSON.stringify(body)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json(
      { success: true, message: "Generator updated successfully", generator: updatedGenerator },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/generator/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method to delete a generator by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  await connectionToDatabase();

  try {
    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    if (decoded.status !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admins only" },
        { status: 403 }
      );
    }

    const deletedGenerator = await Generator.findByIdAndDelete(id);
    if (!deletedGenerator) {
      return NextResponse.json(
        { success: false, message: "Generator not found" },
        { status: 404 }
      );
    }

    // Log the delete action to History
    const history = new History({
      action: "delete",
      dataType: "Generator",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Deleted Generator: ${JSON.stringify(deletedGenerator)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json(
      { success: true, message: "Generator deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/generator/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}