import connectionToDatabase from "@/lib/db";
import Bus from "@/models/Bus";

// DELETE method (for deleting a specific bus)
export async function DELETE(req, { params }) {
  const { id } = params;
  await connectionToDatabase();

  try {
    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) {
      return new Response(JSON.stringify({ success: false, message: "Bus not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Bus deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}

// PATCH method (for updating a specific bus)
export async function PATCH(req, { params }) {
  const { id } = params;
  await connectionToDatabase();

  try {
    const body = await req.json();
    const { busName, location, voltagePower, nominalKV } = body;

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { busName, location, voltagePower, nominalKV },
      { new: true } // Return the updated document
    );

    if (!updatedBus) {
      return new Response(JSON.stringify({ success: false, message: "Bus not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Bus updated successfully", data: updatedBus }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
