import connectionToDatabase from "@/lib/db";
import AcceptedUser from "@/models/AcceptedUser";
import bcrypt from "bcryptjs";

async function fixUserPassword() {
  try {
    await connectionToDatabase();
    const email = "karan@gmail.com";
    const newPassword = "12345";
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await AcceptedUser.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    console.log("Updated user:", updatedUser);
  } catch (error) {
    console.error("Error updating password:", error);
  }
}

fixUserPassword();