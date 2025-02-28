import connectionToDatabase from "@/lib/db";
import Ibr from "@/models/Ibr";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const ibr = await Ibr.findById(params.id);
    if (!ibr) {
      return new Response(JSON.stringify({ success: false, message: "ibr not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, ibr }), { status: 200 });
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
  const { ibr } = await req.json();

  try {
    const updatedIbr = await Ibr.findByIdAndUpdate(params.id, { ibr }, { new: true });
    if (!updatedIbr) {
      return new Response(JSON.stringify({ success: false, message: "Ibr not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Ibr updated successfully", updatedIbr }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update Ibr" }), {
      status: 500,
    });
  }
}

// DELETE method (Delete VSC by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedIbr = await Ibr.findByIdAndDelete(params.id);
    if (!deletedIbr) {
      return new Response(JSON.stringify({ success: false, message: "Ibr not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Ibr deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
