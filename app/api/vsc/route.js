import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Vsc from '@/models/Vsc-hvdc-link';   // Bus mongoose model

// POST method to create a new bus
export async function POST(req) {
  try {
    const { vsc } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', { vsc });

    // Validate the input fields
    if (!vsc) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    // Create and save the new bus document
    const newVsc = new Vsc({
      vsc,
    });

    await newVsc.save();

    // Respond with the newly created bus object
    return NextResponse.json(
      { message: 'Vsc created successfully', vsc: newVsc },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating Vsc:', error);
    return NextResponse.json(
      { error: 'Failed to create Vsc', details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all buses
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connect();

    // Fetch all buses from the database
    const vscs = await Vsc.find();

    // If no buses found, respond with a 404
    if (!vscs || vscs.length === 0) {
      return NextResponse.json(
        { error: 'No Lcc found' },
        { status: 404 }
      );
    }

    // Respond with the list of buses
    return NextResponse.json(
      { vscs }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Lcc:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Lcc', details: error.message },
      { status: 500 }
    );
  }
}
