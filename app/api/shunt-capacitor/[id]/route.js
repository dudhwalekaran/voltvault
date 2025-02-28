import connectionToDatabase from "@/lib/db";
import Shunt from "@/models/shuntCapacitor";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const shunt = await Shunt.findById(params.id);
    if (!shunt) {
      return new Response(
        JSON.stringify({ success: false, message: "shunt not found" }),
        {
          status: 404,
        }
      );
    }
    return new Response(JSON.stringify({ success: true, shunt }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req, { params }) {
  await connectionToDatabase();
  const updates = await req.json();

  try {
    const existingShunt = await Shunt.findById(params.id);
    if (!existingShunt) {
      return new Response(JSON.stringify({ success: false, message: "Shunt not found" }), {
        status: 404,
      });
    }

    // Filter out undefined or empty values to prevent overwriting
    const filteredUpdates = {};
    for (const key in updates) {
      if (updates[key] !== undefined && updates[key] !== "") {
        filteredUpdates[key] = updates[key];
      }
    }

    // Update only provided fields dynamically
    const updatedShunt = await Shunt.findByIdAndUpdate(
      params.id,
      { $set: filteredUpdates },
      { new: true }
    );

    return new Response(JSON.stringify({ success: true, updatedShunt }), { status: 200 });
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
    const deletedCapacitor = await Capacitor.findByIdAndDelete(params.id);
    if (!deletedCapacitor) {
      return new Response(
        JSON.stringify({ success: false, message: "Capacitor not found" }),
        {
          status: 404,
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Capacitor deleted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      {
        status: 500,
      }
    );
  }
}
