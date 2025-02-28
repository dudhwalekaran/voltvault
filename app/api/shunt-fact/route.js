import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Shunt from '@/models/shuntFact';   // Bus mongoose model

// POST method to create a new bus
export async function POST(req) {
  try {
    const { shunt } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', { shunt });

    // Validate the input fields
    if (!shunt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    // Create and save the new bus document
    const newShunt = new Shunt({
      shunt,
    });

    await newShunt.save();

    // Respond with the newly created bus object
    return NextResponse.json(
      { message: 'Shunt Fact created successfully', shunt: newShunt },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating Shunt Fact:', error);
    return NextResponse.json(
      { error: 'Failed to create Shunt Fact', details: error.message },
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
        { error: 'No Shunt Fact found' },
        { status: 404 }
      );
    }

    // Respond with the list of buses
    return NextResponse.json(
      { shunts }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Shunt Fact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Shunt Fact', details: error.message },
      { status: 500 }
    );
  }
}
