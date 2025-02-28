import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import TransformersTwoWinding from '@/models/transformer-two-winding';  // Transformer mongoose model

// POST method to create a new transformer
export async function POST(req) {
  try {
    const {
      location,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      mva,
      kvprimary,
      kvsecondary,
      r,
      x,
      TapPrimary,
      TapSecondary,
      primaryWindingConnection,
      primaryConnectionGrounding,
      secondaryWindingConnection,
      secondaryConnectionGrounding,
      angle,
    } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', {
        location,
        circuitBreakerStatus,
        busFrom,
        busSectionFrom,
        busTo,
        busSectionTo,
        mva,
        kvprimary,
        kvsecondary,
        r,
        x,
        TapPrimary,
        TapSecondary,
        primaryWindingConnection,
        primaryConnectionGrounding,
        secondaryWindingConnection,
        secondaryConnectionGrounding,
        angle,
    });

    // Connect to MongoDB
    await connect();

    // Create and save the new transformer document
    const newTransformer = new TransformersTwoWinding({
        location,
        circuitBreakerStatus,
        busFrom,
        busSectionFrom,
        busTo,
        busSectionTo,
        mva,
        kvprimary,
        kvsecondary,
        r,
        x,
        TapPrimary,
        TapSecondary,
        primaryWindingConnection,
        primaryConnectionGrounding,
        secondaryWindingConnection,
        secondaryConnectionGrounding,
        angle,
    });

    await newTransformer.save();

    // Respond with the newly created transformer object
    return NextResponse.json(
      { message: 'Transformer created successfully', transformer: newTransformer },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating transformer:', error);
    return NextResponse.json(
      { error: 'Failed to create transformer', details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all transformers
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connect();

    // Fetch all transformers from the database
    const transformers = await TransformersTwoWinding.find();

    // If no transformers found, respond with a 404
    if (!transformers || transformers.length === 0) {
      return NextResponse.json(
        { error: 'No transformers found' },
        { status: 404 }
      );
    }

    // Respond with the list of transformers
    return NextResponse.json(
      { transformers }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transformers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transformers', details: error.message },
      { status: 500 }
    );
  }
}
