import connectionToDatabase from "@/lib/db";
import Vsc from "@/models/Vsc-hvdc-link";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const vsc = await Vsc.findById(params.id);
    if (!vsc) {
      return new Response(JSON.stringify({ success: false, message: "VSC not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, vsc }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}

// PUT method (Update VSC by ID)
export async function PUT(req, { params }) {
  await connectionToDatabase();
  const { vsc } = await req.json();

  try {
    const updatedVsc = await Vsc.findByIdAndUpdate(params.id, { vsc }, { new: true });
    if (!updatedVsc) {
      return new Response(JSON.stringify({ success: false, message: "VSC not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "VSC updated successfully", updatedVsc }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update VSC" }), {
      status: 500,
    });
  }
}

// DELETE method (Delete VSC by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedVsc = await Vsc.findByIdAndDelete(params.id);
    if (!deletedVsc) {
      return new Response(JSON.stringify({ success: false, message: "VSC not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "VSC deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
