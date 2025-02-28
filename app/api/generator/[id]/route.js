import connectionToDatabase from "@/lib/db";
import Generator from "@/models/Generator";

// DELETE method
export async function DELETE(req, { params }) {
  const { id } = params; // Extract the ID from the dynamic route
  await connectionToDatabase();

  try {
    const deletedGenerator = await Generator.findByIdAndDelete(id);
    if (!deletedGenerator) {
      return new Response(JSON.stringify({ success: false, message: "Generator not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Generator deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
