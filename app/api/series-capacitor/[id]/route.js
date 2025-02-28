import connectionToDatabase from "@/lib/db";
import Capacitor from "@/models/seriesCapacitor";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const capacitor = await Capacitor.findById(params.id);
    if (!capacitor) {
      return new Response(
        JSON.stringify({ success: false, message: "Capacitor not found" }),
        {
          status: 404,
        }
      );
    }
    return new Response(JSON.stringify({ success: true, capacitor }), {
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
    const existingCapacitor = await Capacitor.findById(params.id);
    if (!existingCapacitor) {
      return new Response(JSON.stringify({ success: false, message: "Capacitor not found" }), {
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
    const updatedCapacitor = await Capacitor.findByIdAndUpdate(
      params.id,
      { $set: filteredUpdates },
      { new: true }
    );

    return new Response(JSON.stringify({ success: true, updatedCapacitor }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update Capacitor" }), {
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
