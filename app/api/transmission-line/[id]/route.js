import connectionToDatabase from "@/lib/db";
import TransmissionLine from "@/models/transmissionLine";

export async function GET(req, { params: { id } }) {
  await connectionToDatabase();
  try {
    const transmissionLine = await TransmissionLine.findById(id);
    if (!transmissionLine) {
      return new Response(
        JSON.stringify({ success: false, message: "Transmission Line not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, transmissionLine }), {
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

export async function PUT(req, { params: { id } }) {
  console.log("Request Method:", req.method);
  console.log("Transmission Line ID:", id);

  if (req.method !== "PUT") {
    return new Response(
      JSON.stringify({ success: false, message: `Invalid Method: ${req.method}` }),
      { status: 405 }
    );
  }

  await connectionToDatabase();

  try {
    const data = await req.json();
    console.log("Received Data:", data); // Logs the entire request body

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or missing ID" }),
        { status: 400 }
      );
    }

    // Update transmission line without manually specifying fields
    const updatedTransmissionLine = await TransmissionLine.findByIdAndUpdate(id, data, { new: true });

    if (!updatedTransmissionLine) {
      return new Response(
        JSON.stringify({ success: false, message: "Transmission Line not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Transmission Line updated", updatedTransmissionLine }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Update failed:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Update failed", error: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params: { id } }) {
  await connectionToDatabase();
  try {
    const deletedTransmissionLine = await TransmissionLine.findByIdAndDelete(id);
    if (!deletedTransmissionLine) {
      return new Response(
        JSON.stringify({ success: false, message: "Transmission Line not found" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Transmission Line deleted successfully",
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
