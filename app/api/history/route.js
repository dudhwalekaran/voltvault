import { NextResponse } from "next/server";
import connect from "@/lib/db";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function GET(req) {
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

    const history = await History.find().sort({ timestamp: -1 }); // Sort by timestamp, newest first

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Error fetching history:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch history", details: error.message },
      { status: 500 }
    );
  }
}