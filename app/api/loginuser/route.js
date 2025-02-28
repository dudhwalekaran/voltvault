import dbConnect from "@/lib/db";
import User from "@/models/AcceptedUser";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const users = await User.find({}, { password: 0 }); // Exclude password field

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
