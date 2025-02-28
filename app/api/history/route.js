import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/db";
import History from "@/models/History";

export async function GET() {
  await connectionToDatabase();
  try {
    const history = await History.find().sort({ timestamp: -1 });
    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

export async function POST(req) {
  await connectionToDatabase();
  try {
    const body = await req.json(); // Parse request body
    const { user_name, user_email, affected_section, affected_id, action } = body;
    const newHistory = new History({ user_name, user_email, affected_section, affected_id, action });
    await newHistory.save();
    return NextResponse.json(newHistory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error saving history", error }, { status: 500 });
  }
}
