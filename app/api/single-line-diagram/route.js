import connectDB from "@/lib/db"; // MongoDB connection utility
import SingleLineDiagram from "@/models/SingleLineDiagram"; // Import the schema

// POST handler to save data
export async function POST(req) {
  const { description, imageUrl } = await req.json();

  // Connect to the database
  try {
    await connectDB();

    // Create a new diagram entry
    const newDiagram = new SingleLineDiagram({
      description,
      imageUrl,
    });

    // Save the diagram to MongoDB
    const result = await newDiagram.save();

    return new Response(JSON.stringify({ message: "Diagram saved successfully", result }), {
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
    const diagrams = await SingleLineDiagram.find({});

    // Return fetched data as a JSON response
    return new Response(JSON.stringify({ diagrams }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching diagrams:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch diagrams" }), { status: 500 });
  }
}
