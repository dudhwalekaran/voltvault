import connectDB from "@/lib/db"; // Assuming this is your MongoDB connection utility
import ExcitationSystem from "@/models/ExcitationSystem"; // Import the Excitation System schema

// GET (Fetch a single excitation system by ID)
export async function GET(req, { params }) {
  await connectDB();
  try {
    const excitation = await ExcitationSystem.findById(params.id);
    if (!excitation) {
      return new Response(JSON.stringify({ success: false, message: "Excitation system not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, excitation }), { status: 200 });
  } catch (error) {
    console.error("Error fetching excitation system:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}

// PUT (Update excitation system by ID)
export async function PUT(req, { params }) {
  await connectDB();
  const { 
    location, 
    avrType, 
    generatorDeviceName, 
    avrImageUrl, 
    pssImageUrl, 
    uelImageUrl, 
    oelImageUrl 
  } = await req.json();

  try {
    const updatedExcitation = await ExcitationSystem.findByIdAndUpdate(
      params.id, 
      { 
        location, 
        avrType, 
        generatorDeviceName, 
        avrImageUrl, 
        pssImageUrl, 
        uelImageUrl, 
        oelImageUrl 
      }, 
      { new: true }
    );
    if (!updatedExcitation) {
      return new Response(JSON.stringify({ success: false, message: "Excitation system not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, message: "Excitation system updated", updatedExcitation }), { status: 200 });
  } catch (error) {
    console.error("Error updating excitation system:", error);
    return new Response(JSON.stringify({ success: false, message: "Update failed" }), { status: 500 });
  }
}

// DELETE (Remove excitation system by ID)
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const deletedExcitation = await ExcitationSystem.findByIdAndDelete(params.id);
    if (!deletedExcitation) {
      return new Response(JSON.stringify({ success: false, message: "Excitation system not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, message: "Excitation system deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting excitation system:", error);
    return new Response(JSON.stringify({ success: false, message: "Delete failed" }), { status: 500 });
  }
}