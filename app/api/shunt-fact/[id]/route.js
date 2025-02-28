import connectionToDatabase from "@/lib/db";
import ShuntFact from "@/models/shuntFact";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const shunt = await ShuntFact.findById(params.id);
    if (!shunt) {
      return new Response(JSON.stringify({ success: false, message: "Shunt not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, shunt }), { status: 200 });
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
  const { shunt } = await req.json();

  try {
    const updatedShuntFact = await ShuntFact.findByIdAndUpdate(params.id, { shunt }, { new: true });
    if (!updatedShuntFact) {
      return new Response(JSON.stringify({ success: false, message: "Shunt not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Shunt updated successfully", updatedShuntFact }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update Shunt" }), {
      status: 500,
    });
  }
}

// DELETE method (Delete VSC by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedShuntFact = await ShuntFact.findByIdAndDelete(params.id);
    if (!deletedShuntFact) {
      return new Response(JSON.stringify({ success: false, message: "Shunt not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Shunt deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
