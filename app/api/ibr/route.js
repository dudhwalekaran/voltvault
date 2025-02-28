import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Ibr from '@/models/Ibr';   // Bus mongoose model

// POST method to create a new bus
export async function POST(req) {
  try {
    const { ibr } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', { ibr });

    // Validate the input fields
    if (!ibr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    // Create and save the new bus document
    const newIbr = new Ibr({
      ibr,
    });

    await newIbr.save();

    // Respond with the newly created bus object
    return NextResponse.json(
      { message: 'Bus created successfully', ibr: newIbr },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating bus:', error);
    return NextResponse.json(
      { error: 'Failed to create bus', details: error.message },
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
    const ibrs = await Ibr.find();

    // If no buses found, respond with a 404
    if (!ibrs || ibrs.length === 0) {
      return NextResponse.json(
        { error: 'No Ibr found' },
        { status: 404 }
      );
    }

    // Respond with the list of buses
    return NextResponse.json(
      { ibrs }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching buses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buses', details: error.message },
      { status: 500 }
    );
  }
}
