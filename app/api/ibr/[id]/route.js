import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Ibr from "@/models/Ibr";
import History from "@/models/History";
import jwt from "jsonwebtoken";

// GET method to fetch an individual IBR by ID
export async function GET(req, { params }) {
  try {
    await connect();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing IBR ID" }, { status: 400 });
    }

    const ibr = await Ibr.findById(id);
    if (!ibr) {
      return NextResponse.json({ error: "IBR not found" }, { status: 404 });
    }

    return NextResponse.json({ ibr }, { status: 200 });
  } catch (error) {
    console.error("Error fetching IBR:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch IBR", details: error.message },
      { status: 500 }
    );
  }
}

// PUT method to update an IBR
export async function PUT(req, { params }) {
  try {
    const { ibr } = await req.json();

    if (!ibr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    const authHeader = req.headers.get("authorization");
    console.log("Authorization header:", authHeader); // Debug: Log the header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization failed: No token provided or incorrect format");
      return NextResponse.json({ error: "Unauthorized: No token provided or incorrect format" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token); // Debug: Log the token
    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET not found in environment variables");
      return NextResponse.json({ error: "Server configuration error: JWT_SECRET missing" }, { status: 500 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug: Log the decoded token
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return NextResponse.json({ error: `Invalid token: ${error.message}` }, { status: 401 });
    }

    if (decoded.status !== "admin") {
      console.log("User role:", decoded.status, "- Unauthorized: Admins only");
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing IBR ID" }, { status: 400 });
    }

    const updatedIbr = await Ibr.findByIdAndUpdate(id, { ibr }, { new: true });
    if (!updatedIbr) {
      return NextResponse.json({ error: "IBR not found" }, { status: 404 });
    }

    // Log the update action to History
    const history = new History({
      action: "update",
      dataType: "IBR",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Updated IBR: ${JSON.stringify({ ibr })}`,
    });
    await history.save();

    return NextResponse.json({ message: "IBR updated successfully", ibr: updatedIbr }, { status: 200 });
  } catch (error) {
    console.error("Error updating IBR:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to update IBR", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE method to delete an IBR
export async function DELETE(req, { params }) {
  try {
    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing IBR ID" }, { status: 400 });
    }

    const deletedIbr = await Ibr.findByIdAndDelete(id);
    if (!deletedIbr) {
      return NextResponse.json({ error: "IBR not found" }, { status: 404 });
    }

    // Log the delete action to History
    const history = new History({
      action: "delete",
      dataType: "IBR",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Deleted IBR: ${JSON.stringify(deletedIbr)}`,
    });
    await history.save();

    return NextResponse.json({ message: "IBR deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting IBR:", error.message);
    return NextResponse.json(
      { error: "Failed to delete IBR", details: error.message },
      { status: 500 }
    );
  }
}