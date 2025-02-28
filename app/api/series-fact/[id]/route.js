import connectionToDatabase from "@/lib/db";
import Series from "@/models/seriesFact";

// GET method (Fetch a single VSC by ID)
export async function GET(req, { params }) {
  await connectionToDatabase();
  try {
    const series = await Series.findById(params.id);
    if (!series) {
      return new Response(JSON.stringify({ success: false, message: "Series not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, series }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}

// PUT method (Update VSC by ID)
export async function PUT(req, { params }) {
  await connectionToDatabase();
  const { series } = await req.json();

  try {
    const updatedSeries = await Series.findByIdAndUpdate(params.id, { series }, { new: true });
    if (!updatedSeries) {
      return new Response(JSON.stringify({ success: false, message: "Series not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Series updated successfully", updatedSeries }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update Series" }), {
      status: 500,
    });
  }
}

// DELETE method (Delete VSC by ID)
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  try {
    const deletedSeries = await Series.findByIdAndDelete(params.id);
    if (!deletedSeries) {
      return new Response(JSON.stringify({ success: false, message: "Series not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Series deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}
