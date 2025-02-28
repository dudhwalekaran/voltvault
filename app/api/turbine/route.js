import connectDB from "@/lib/db"; // MongoDB connection utility
import Turbine from "@/models/Turbine"; // Import the schema

// POST handler to save data
export async function POST(req) {
  const { location, turbineType, deviceName, imageUrl } = await req.json();

  // Connect to the database
  try {
    await connectDB();

    // Create a new diagram entry
    const newTurbine = new Turbine({
      location,
      turbineType,
      deviceName,
      imageUrl,
    });

    // Save the diagram to MongoDB
    const result = await newTurbine.save();

    return new Response(JSON.stringify({ message: "Turbine saved successfully", result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving to database:", error);
    return new Response(JSON.stringify({ error: "Failed to save Turbine" }), { status: 500 });
  }
}

// GET handler to fetch saved data
export async function GET(req) {
  try {
    await connectDB();  // Connect to the database

    // Fetch all diagrams from MongoDB
    const turbines = await Turbine.find({});

    // Return fetched data as a JSON response
    return new Response(JSON.stringify({ turbines }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching diagrams:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch diagrams" }), { status: 500 });
  }
}
