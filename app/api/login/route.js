import connectionToDatabase from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectionToDatabase();

    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
    }

    const user = await AcceptedUser.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "Email not found" }), { status: 401 });
    }

    console.log("Comparing password - Input:", password, "Stored hash:", user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Incorrect password" }), { status: 401 });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, status: user.adminStatus },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await AcceptedUser.findOneAndUpdate(
      { email: user.email },
      { lastLogin: new Date() },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: { email: user.email, name: user.name, status: user.adminStatus },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error during login:", error.message);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}