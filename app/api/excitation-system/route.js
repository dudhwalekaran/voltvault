import connectDB from "@/lib/db"; // MongoDB connection utility
import ExcitationSystem from "@/models/ExcitationSystem"; // Import the schema

// POST handler to save data
export async function POST(req) {
  const { location, avrType, generatorDeviceName, pssImageUrl, avrImageUrl, oelImageUrl, uelImageUrl } = await req.json();

  // Connect to the database
  try {
    await connectDB();

    // Create a new diagram entry
    const newExcitation = new ExcitationSystem({
      location,
      avrType,
      generatorDeviceName,
      pssImageUrl,
      avrImageUrl,
      oelImageUrl,
      uelImageUrl,
    });

    // Save the diagram to MongoDB
    const result = await newExcitation.save();

    return new Response(JSON.stringify({ message: "Excitation saved successfully", result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving to database:", error);
    return new Response(JSON.stringify({ error: "Failed to save diagram" }), { status: 500 });
  }
}

// GET handler to fetch saved data
export async function GET(req) {
  try {
    await connectDB();  // Connect to the database

    // Fetch all diagrams from MongoDB
    const excitations = await ExcitationSystem.find({});

    // Return fetched data as a JSON response
    return new Response(JSON.stringify({ excitations }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching diagrams:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch diagrams" }), { status: 500 });
  }
}
