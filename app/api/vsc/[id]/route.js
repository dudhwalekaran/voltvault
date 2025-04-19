import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Vsc from "@/models/Vsc-hvdc-link";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    await connectDB();
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

    const vsc = await Vsc.findById(params.id);
    if (!vsc) {
      return NextResponse.json({ error: "VSC not found" }, { status: 404 });
    }

    return NextResponse.json({ vsc }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/vsc/[id]:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
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

    const { vsc } = await req.json();
    if (!vsc) {
      return NextResponse.json({ error: "Missing required field: vsc is required" }, { status: 400 });
    }

    const existingVsc = await Vsc.findById(params.id);
    if (!existingVsc) {
      return NextResponse.json({ error: "VSC not found" }, { status: 404 });
    }

    const updatedVsc = await Vsc.findByIdAndUpdate(params.id, { vsc }, { new: true });

    // Compare old and new values to identify changes
    const changes = [];
    if (existingVsc.vsc !== vsc) {
      changes.push(`Changed vsc from "${existingVsc.vsc}" to "${vsc}"`);
    }

    // Log the update action to History with specific changes
    const details = changes.length > 0 ? changes.join(", ") : "No fields changed";
    const history = new History({
      action: "update",
      dataType: "Vsc",
      recordId: params.id,
      adminEmail: decoded.email || decoded.userId,
      adminName: decoded.username || decoded.name || "Unknown",
      details: `Updated VSC: ${details}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json({ success: true, vsc: updatedVsc }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/vsc/[id]:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
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

    const deletedVsc = await Vsc.findByIdAndDelete(params.id);
    if (!deletedVsc) {
      return NextResponse.json({ error: "VSC not found" }, { status: 404 });
    }

    // Log the delete action to History
    const history = new History({
      action: "delete",
      dataType: "Vsc",
      recordId: params.id,
      adminEmail: decoded.email || decoded.userId,
      adminName: decoded.username || decoded.name || "Unknown",
      details: `Deleted VSC: ${JSON.stringify(deletedVsc)}`,
    });
    await history.save();
    console.log("History entry created:", history);

    return NextResponse.json({ success: true, message: "VSC deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/vsc/[id]:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}