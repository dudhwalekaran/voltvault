import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Lcc from '@/models/Lcc-hvdc-link';   // Bus mongoose model

// POST method to create a new bus
export async function POST(req) {
  try {
    const { lcc } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', { lcc });

    // Validate the input fields
    if (!lcc) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    // Create and save the new bus document
    const newLcc = new Lcc({
      lcc,
    });

    await newLcc.save();

    // Respond with the newly created bus object
    return NextResponse.json(
      { message: 'Lcc created successfully', lcc: newLcc },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating Lcc:', error);
    return NextResponse.json(
      { error: 'Failed to create Lcc', details: error.message },
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
    const lccs = await Lcc.find();

    // If no buses found, respond with a 404
    if (!lccs || lccs.length === 0) {
      return NextResponse.json(
        { error: 'No Lcc found' },
        { status: 404 }
      );
    }

    // Respond with the list of buses
    return NextResponse.json(
      { lccs }, 
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
