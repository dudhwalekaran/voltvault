import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Shunt from '@/models/shuntReactor';   // Load mongoose model

// POST method to create a new bus
export async function POST(req) {
  try {
    const { location, circuitBreaker, busFrom, busSectionFrom, kv, mva } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', { location, circuitBreaker, busFrom, busSectionFrom, kv, mva });

    // Validate the input fields
    if (!location || circuitBreaker === undefined || !busFrom || !busSectionFrom || !kv === "" || !mva === "") {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    // Create and save the new bus document
    const newShunt = new Shunt({
      location,
      circuitBreaker,
      busFrom,
      busSectionFrom,
      kv,
      mva,
    });

    await newShunt.save();

    // Respond with the newly created bus object
    return NextResponse.json(
      { message: 'Load created successfully', shunt: newShunt },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating Load:', error);
    return NextResponse.json(
      { error: 'Failed to create Load', details: error.message },
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
    const shunts = await Shunt.find();

    // If no buses found, respond with a 404
    if (!shunts || shunts.length === 0) {
      return NextResponse.json(
        { error: 'No buses found' },
        { status: 404 }
      );
    }

    // Respond with the list of buses
    return NextResponse.json(
      { shunts }, 
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
