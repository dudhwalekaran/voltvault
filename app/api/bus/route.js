import { NextResponse } from "next/server";
import connect from "@/lib/db"; // MongoDB connection helper
import Bus from "@/models/Bus"; // Bus mongoose model
import PendingRequest from "@/models/PendingRequest"; // Pending request model
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { busName, location, voltagePower, nominalKV } = await req.json().catch(() => ({}));
    console.log("Received data:", { busName, location, voltagePower, nominalKV });

    if (!busName || !location || !voltagePower || !nominalKV) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    // Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const role = decoded.status; // Extract role (adminStatus: "admin" or "user")
    const description = `Add Bus: ${busName} at ${location}`;

    if (role === "admin") {
      const newBus = new Bus({ busName, location, voltagePower, nominalKV });
      await newBus.save();
      return NextResponse.json({ message: "Bus created successfully", bus: newBus }, { status: 201 });
    } else if (role === "user") {
      const pendingRequest = new PendingRequest({
        dataType: "Bus",
        data: { busName, location, voltagePower, nominalKV },
        submittedBy: decoded.email,
        username: decoded.name,
        email: decoded.email,
        description,
        status: "pending",
      });
      await pendingRequest.save();
      return NextResponse.json({ message: "Request submitted for approval" }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Error creating bus:", error.message);
    return NextResponse.json({ error: "Failed to create bus", details: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connect();
    const buses = await Bus.find();
    if (!buses || buses.length === 0) {
      return NextResponse.json({ error: "No buses found" }, { status: 404 });
    }
    return NextResponse.json({ buses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching buses:", error.message);
    return NextResponse.json({ error: "Failed to fetch buses", details: error.message }, { status: 500 });
  }
}