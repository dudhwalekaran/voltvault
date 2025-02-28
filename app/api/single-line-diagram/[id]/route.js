import connectionToDatabase from "@/lib/db";
import SingleLineDiagram from "@/models/SingleLineDiagram";

// GET (Fetch a single diagram by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const diagram = await SingleLineDiagram.findById(params.id);
    if (!diagram) {
      return new Response(JSON.stringify({ success: false, message: "Diagram not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, diagram }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}

// PUT (Update diagram by ID)
export async function PUT(req, { params }) {
  await connectionToDatabase();
  const { description, imageUrl } = await req.json();

  try {
    const updatedDiagram = await SingleLineDiagram.findByIdAndUpdate(params.id, { description, imageUrl }, { new: true });
    if (!updatedDiagram) {
      return new Response(JSON.stringify({ success: false, message: "Diagram not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, message: "Diagram updated", updatedDiagram }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Update failed" }), { status: 500 });
  }
}

// DELETE (Remove diagram by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedDiagram = await SingleLineDiagram.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ success: true, message: "Diagram deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Delete failed" }), { status: 500 });
  }
}
