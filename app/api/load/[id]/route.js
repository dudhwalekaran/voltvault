import connectionToDatabase from "@/lib/db";
import Load from "@/models/Load";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const load = await Load.findById(params.id);
    if (!load) {
      return new Response(JSON.stringify({ success: false, message: "Load not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, load }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  await connectionToDatabase();
  const updates = await req.json();  // Directly take only sent fields

  try {
    const updatedLoad = await Load.findByIdAndUpdate(params.id, updates, { new: true });
    if (!updatedLoad) {
      return new Response(JSON.stringify({ success: false, message: "Load not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Load updated successfully", updatedLoad }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update Load" }), {
      status: 500,
    });
  }
}



// DELETE method (Delete VSC by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedLoad = await Load.findByIdAndDelete(params.id);
    if (!deletedLoad) {
      return new Response(JSON.stringify({ success: false, message: "Load not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Load deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
