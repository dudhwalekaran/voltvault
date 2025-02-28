import connectionToDatabase from "@/lib/db";
import Turbine from "@/models/Turbine";

export async function GET(req, { params: { id } }) {
  await connectionToDatabase();
  try {
    const turbine = await Turbine.findById(id);
    if (!turbine) {
      return new Response(
        JSON.stringify({ success: false, message: "Turbine not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, turbine }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  console.log("Request Method:", req.method); // Log method
  console.log("Params:", params); // Log params

  if (req.method !== "PUT") {
    return new Response(
      JSON.stringify({
        success: false,
        message: `Invalid Method: ${req.method}`,
      }),
      { status: 405 }
    );
  }

  await connectionToDatabase();

  try {
    const { location, turbineType, deviceName, imageUrl } = await req.json();

    const updatedTurbine = await Turbine.findByIdAndUpdate(
      params.id,
      { location, turbineType, deviceName, imageUrl },
      { new: true }
    );

    if (!updatedTurbine) {
      return new Response(
        JSON.stringify({ success: false, message: "Turbine not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Turbine updated",
        updatedTurbine,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Update failed" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params: { id } }) {
  await connectionToDatabase();
  try {
    const deletedTurbine = await Turbine.findByIdAndDelete(id);
    if (!deletedTurbine) {
      return new Response(
        JSON.stringify({ success: false, message: "Turbine not found" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Turbine deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
