import connect from "@/lib/db";
import PendingRequest from "@/models/PendingRequest";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Verify JWT (but allow any authenticated user)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET); // Just verify the token exists

    await connect();
    const pendingRequests = await PendingRequest.find();

    return NextResponse.json(
      { success: true, pendingRequests },
      { status: pendingRequests.length > 0 ? 200 : 404 }
    );
  } catch (error) {
    console.error("Error fetching pending requests:", error.message);
    return NextResponse.json({ success: false, error: "Failed to fetch pending requests" }, { status: 500 });
  }
}