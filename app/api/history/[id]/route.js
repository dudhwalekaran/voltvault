import { NextResponse } from "next/server";
import connect from "@/lib/db";
import History from "@/models/History";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  try {
    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided or incorrect format" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing history ID" }, { status: 400 });
    }

    const deletedHistory = await History.findByIdAndDelete(id);
    if (!deletedHistory) {
      return NextResponse.json({ error: "History entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "History entry deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting history entry:", error.message);
    return NextResponse.json(
      { error: "Failed to delete history entry", details: error.message },
      { status: 500 }
    );
  }
}