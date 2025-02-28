import bcrypt from 'bcrypt';
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      status: "pending",
      requestedAt: new Date(),
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User request submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error details:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
