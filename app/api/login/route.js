import connectionToDatabase from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import bcrypt from "bcryptjs";  // ✅ Use bcryptjs

export async function POST(req) {
  try {
    await connectionToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await AcceptedUser.findOne({ email });
    console.log("User found:", user);  // ✅ Debugging

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Debug: Check hashed passwords
    console.log("Provided password:", password);
    console.log("Stored hashed password:", user.password);

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid?", isPasswordValid);  // ✅ Debugging

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { email: user.email, name: user.name },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
