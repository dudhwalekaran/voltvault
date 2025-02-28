import connectionToDatabase from "@/lib/db";
import Lcc from "@/models/Lcc-hvdc-link";

// GET method (Fetch a single LCC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const lcc = await Lcc.findById(params.id);
    if (!lcc) {
      return new Response(JSON.stringify({ success: false, message: "LCC not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, lcc }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}

// PUT method (Update LCC by ID)
export async function PUT(req, { params }) {
  await connectionToDatabase();
  const { lcc } = await req.json();

  try {
    const updatedLcc = await Lcc.findByIdAndUpdate(params.id, { lcc }, { new: true });
    if (!updatedLcc) {
      return new Response(JSON.stringify({ success: false, message: "LCC not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "LCC updated successfully", updatedLcc }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update LCC" }), {
      status: 500,
    });
  }
}

// DELETE method (Delete LCC by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedLcc = await Lcc.findByIdAndDelete(params.id);
    if (!deletedLcc) {
      return new Response(JSON.stringify({ success: false, message: "LCC not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "LCC deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
