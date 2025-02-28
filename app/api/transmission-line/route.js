import { NextResponse } from 'next/server';
import connect from '@/lib/db'; // MongoDB connection helper
import TransmissionLine from '@/models/transmissionLine'; // TransmissionLine mongoose model

// POST method to create a new transmission line
export async function POST(req) {
  try {
    const {
      location1,
      location2,
      type,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      kv,
      positiveSequenceRohmsperunitlength,
      positiveSequenceXohmsperunitlength,
      positiveSequenceBseimensperunitlength,
      negativeSequenceRohmsperunitlength,
      negativeSequenceXohmsperunitlength,
      negativeSequenceBseimensperunitlength,
      lengthKm,
      lineReactorFrom,
      lineReactorTo,
    } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', {
      location1,
      location2,
      type,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      kv,
      positiveSequenceRohmsperunitlength,
      positiveSequenceXohmsperunitlength,
      positiveSequenceBseimensperunitlength,
      negativeSequenceRohmsperunitlength,
      negativeSequenceXohmsperunitlength,
      negativeSequenceBseimensperunitlength,
      lengthKm,
      lineReactorFrom,
      lineReactorTo,
    });

    // Connect to MongoDB
    await connect();

    // Create and save the new transmission line document
    const newTransmissionLine = new TransmissionLine({
      location1,
      location2,
      type,
      circuitBreakerStatus,
      busFrom,
      busSectionFrom,
      busTo,
      busSectionTo,
      kv,
      positiveSequenceRohmsperunitlength,
      positiveSequenceXohmsperunitlength,
      positiveSequenceBseimensperunitlength,
      negativeSequenceRohmsperunitlength,
      negativeSequenceXohmsperunitlength,
      negativeSequenceBseimensperunitlength,
      lengthKm,
      lineReactorFrom,
      lineReactorTo,
    });

    await newTransmissionLine.save();

    // Respond with the newly created transmission line object
    return NextResponse.json(
      { message: 'Transmission line created successfully', transmissionLine: newTransmissionLine },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transmission line:', error);
    return NextResponse.json(
      { error: 'Failed to create transmission line', details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all transmission lines
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connect();

    // Fetch all transmission lines from the database
    const transmissionLines = await TransmissionLine.find();

    // If no transmission lines found, respond with a 404
    if (!transmissionLines || transmissionLines.length === 0) {
      return NextResponse.json(
        { error: 'No transmission lines found' },
        { status: 404 }
      );
    }

    // Respond with the list of transmission lines
    return NextResponse.json(
      { transmissionLines },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transmission lines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transmission lines', details: error.message },
      { status: 500 }
    );
  }
}
