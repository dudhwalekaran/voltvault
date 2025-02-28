import connectionToDatabase from "@/lib/db";
import TransformersThreeWinding from "@/models/transformersThreeWinding";

// DELETE method
export async function DELETE(req, { params }) {
  const { id } = params; // Extract the ID from the dynamic route
  await connectionToDatabase();

  try {
    const deletedTransformersThreeWinding = await TransformersThreeWinding.findByIdAndDelete(id);
    if (!deletedTransformersThreeWinding) {
      return new Response(JSON.stringify({ success: false, message: "Winding not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Winding deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
