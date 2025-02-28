import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Series from '@/models/seriesFact';   // Bus mongoose model

// POST method to create a new bus
export async function POST(req) {
  try {
    const { series } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', { series });

    // Validate the input fields
    if (!series) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    // Create and save the new bus document
    const newSeries = new Series({
      series,
    });

    await newSeries.save();

    // Respond with the newly created bus object
    return NextResponse.json(
      { message: 'Series Fact created successfully', series: newSeries },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating Series Fact:', error);
    return NextResponse.json(
      { error: 'Failed to create Series Fact', details: error.message },
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
    const seriess = await Series.find();

    // If no buses found, respond with a 404
    if (!seriess || seriess.length === 0) {
      return NextResponse.json(
        { error: 'No Series Fact found' },
        { status: 404 }
      );
    }

    // Respond with the list of buses
    return NextResponse.json(
      { seriess }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Series Fact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Series Fact', details: error.message },
      { status: 500 }
    );
  }
}
