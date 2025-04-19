import dbConnect from "@/lib/db";
import User from "@/models/User";
import AcceptedUser from "@/models/AcceptedUser";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const id = searchParams.get("id");

    if (!action || !id) {
      return new Response(JSON.stringify({ message: "Missing action or ID" }), {
        status: 400,
      });
    }

    switch (action) {
      case "accept": {
        const acceptedUser = await User.findByIdAndUpdate(
          id,
          { status: "accepted" },
          { new: true }
        );
    
        if (!acceptedUser) {
          return new Response(JSON.stringify({ success: false, message: "User not found" }), {
            status: 404,
          });
        }
    
        await AcceptedUser.create({
          name: acceptedUser.name,
          email: acceptedUser.email,
          password: acceptedUser.password,
          status: "active",
          adminStatus: "user",
          lastLogin: new Date(),
          createdAt: new Date(),
        });
    
        await sendEmail(
          acceptedUser.email,
          "Your request has been accepted to VoltVault IITB",
          "You can now log in with your credentials."
        );
    
        return new Response(
          JSON.stringify({ success: true, message: "User accepted successfully" }),
          { status: 200 }
        );
      }
    
      case "reject": {
        const rejectedUser = await User.findByIdAndUpdate(
          id,
          { status: "rejected" },
          { new: true }
        );
    
        if (!rejectedUser) {
          return new Response(JSON.stringify({ success: false, message: "User not found" }), {
            status: 404,
          });
        }
    
        await sendEmail(
          rejectedUser.email,
          "Your request has been rejected to VoltVault IITB",
          "Sorry, your request has been rejected."
        );
    
        return new Response(
          JSON.stringify({ success: true, message: "User rejected successfully" }),
          { status: 200 }
        );
      }
    
      default:
        return new Response(JSON.stringify({ success: false, message: "Invalid action" }), {
          status: 400,
        });
    }
  } catch (error) {
    console.error("Error handling POST action:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

// DELETE handler
export async function DELETE(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ message: "Missing ID" }), {
        status: 400,
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling DELETE action:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
