import connectDB from "@/lib/db";
import ExcitationSystem from "@/models/ExcitationSystem";

export async function POST(req) {
  const { 
    location, 
    avr, 
    generator, 
    pssImageUrl, 
    avrImageUrl, 
    extraImage1Url, 
    extraImage2Url 
  } = await req.json();

  console.log("Request body:", { location, avr, generator, pssImageUrl, avrImageUrl, extraImage1Url, extraImage2Url });

  try {
    await connectDB();

    const newExcitation = new ExcitationSystem({
      location,
      avrType: avr,
      generatorDeviceName: generator,
      pssImageUrl,
      avrImageUrl,
      oelImageUrl: extraImage2Url,
      uelImageUrl: extraImage1Url,
    });

    const result = await newExcitation.save();

    return new Response(JSON.stringify({ message: "Excitation saved successfully", result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving to database:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Failed to save diagram" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const excitations = await ExcitationSystem.find({});
    return new Response(JSON.stringify({ excitations }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching diagrams:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Failed to fetch diagrams" }), { status: 500 });
  }
}