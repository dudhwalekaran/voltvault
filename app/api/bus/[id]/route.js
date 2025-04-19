import { NextResponse } from "next/server";
import connect from "@/lib/db"; // MongoDB connection helper
import Bus from "@/models/Bus"; // Bus mongoose model
import History from "@/models/History"; // History model for logging actions
import jwt from "jsonwebtoken";

// GET: Fetch bus details by ID
export async function GET(req, { params }) {
  const { id } = params;
  await connect();

  try {
    const bus = await Bus.findById(id);
    if (!bus) {
      return NextResponse.json({ success: false, message: "Bus not found" }, { status: 404 });
    }
    return NextResponse.json(bus, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, message: "Server error", details: error.message }, { status: 500 });
  }
}

// PATCH: Update bus details by ID
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    await connect();

    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided or incorrect format" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token", details: error.message }, { status: 401 });
    }

    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const body = await req.json();
    const { busName, location, voltagePower, nominalKV } = body;

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { busName, location, voltagePower, nominalKV },
      { new: true }
    );

    if (!updatedBus) {
      return NextResponse.json({ success: false, message: "Bus not found" }, { status: 404 });
    }

    // Log the update action to History
    const history = new History({
      action: "update",
      dataType: "Bus",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Updated Bus: ${JSON.stringify({ busName, location, voltagePower, nominalKV })}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json(updatedBus, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete bus by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connect();

    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided or incorrect format" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token", details: error.message }, { status: 401 });
    }

    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) {
      return NextResponse.json({ success: false, message: "Bus not found" }, { status: 404 });
    }

    // Log the delete action to History
    const history = new History({
      action: "delete",
      dataType: "Bus",
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Deleted Bus: ${JSON.stringify(deletedBus)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json({ success: true, message: "Bus deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}