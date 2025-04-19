import connect from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import PendingRequest from "@/models/PendingRequest";
import jwt from "jsonwebtoken";

// Dynamic model loading for all data types
const models = {
  bus: require("@/models/Bus").default,
  ibr: require("@/models/Ibr").default,
  load: require("@/models/Load").default,
  generator: require("@/models/Generator").default,
  excitation: require("@/models/ExcitationSystem").default,
  seriescapacitor: require("@/models/seriesCapacitor").default,
  shuntcapacitor: require("@/models/shuntCapacitor").default,
};

export async function PATCH(req, { params }) {
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
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid request ID format" }, { status: 400 });
    }

    const request = await PendingRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    let { dataType, data } = request;

    if (!dataType || !data) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const TargetModel = models[dataType.toLowerCase()];
      if (!TargetModel) {
        return NextResponse.json({ error: `No model found for dataType: ${dataType}` }, { status: 400 });
      }

      const newRecord = new TargetModel(data);
      const validationError = newRecord.validateSync();
      if (validationError) {
        console.error("❌ Schema validation failed:", validationError.errors);
        return NextResponse.json({ error: "Invalid data format", details: validationError.message }, { status: 400 });
      }

      await newRecord.save();
      // Removed the deletion of the request from PendingRequest
    } else if (status === "rejected") {
      await PendingRequest.findByIdAndDelete(id);
    }

    return NextResponse.json({ message: "Request updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating request:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to update request", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connect().catch((err) => {
      throw new Error(`Database connection failed: ${err.message}`);
    });

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Server configuration error: JWT_SECRET missing" }, { status: 500 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: `Invalid token: ${err.message}` }, { status: 401 });
    }
    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid request ID format" }, { status: 400 });
    }

    const request = await PendingRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await PendingRequest.findByIdAndDelete(id);

    return NextResponse.json({ message: "Request deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting request:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to delete request", details: error.message }, { status: 500 });
  }
}