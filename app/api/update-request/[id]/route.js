import connect from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import PendingRequest from "@/models/PendingRequest";
import Bus from "@/models/Bus";
import Generator from "@/models/Generator";
import jwt from "jsonwebtoken";

const models = {
  bus: Bus,
  generator: Generator,
};

export async function PATCH(req, { params }) {
  try {
    await connect();

    // Verify JWT and role (keep admin-only for updates)
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

    console.log(`🔵 Updating request ID: ${id}`);

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

      const normalizedData = {
        ...data,
        nominalKV: data.nominalKv || data.nominalKV,
      };
      delete normalizedData.nominalKv;

      const newData = new TargetModel(normalizedData);
      const validationError = newData.validateSync();
      if (validationError) {
        console.error("❌ Schema validation failed:", validationError.errors);
        return NextResponse.json({ error: "Invalid data format", details: validationError.message }, { status: 400 });
      }

      await newData.save();
      await PendingRequest.findByIdAndDelete(id);
    } else if (status === "rejected") {
      await PendingRequest.findByIdAndDelete(id);
    }

    return NextResponse.json({ message: "Request updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating request:", error.message);
    return NextResponse.json({ error: "Failed to update request", details: error.message }, { status: 500 });
  }
}