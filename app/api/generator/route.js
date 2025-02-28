import { NextResponse } from 'next/server';
import connect from '@/lib/db';  // MongoDB connection helper
import Generator from '@/models/Generator';  // Generator mongoose model

// POST method to create a new generator
export async function POST(req) {
  try {
    const {
      location,
      circuitBreakerStatus,
      busTo,
      busSectionTo,
      type,
      rotor,
      mw,
      mva,
      kv,
      synchronousReactancePuXd,
      synchronousReactancePuXq,
      transientReactancePuXdPrime,
      transientReactancePuXqPrime,
      subtransientReactancePuXdPrimePrime,
      subtransientReactancePuXqPrimePrime,
      transientOCTimeConstantSecondsTd0Prime,
      transientOCTimeConstantSecondsTq0Prime,
      subtransientOCTimeConstantSecondsTd0PrimePrime,
      subtransientOCTimeConstantSecondsTq0PrimePrime,
      statorLeakageInductancePuXl,
      statorResistancePuRa,
      inertiaMJMVAH,
      poles,
      speed,
      frequency,
    } = await req.json().catch(() => ({}));

    // Log the data received (for debugging)
    console.log('Received data:', {
      location,
      circuitBreakerStatus,
      busTo,
      busSectionTo,
      type,
      rotor,
      mw,
      mva,
      kv,
      synchronousReactancePuXd,
      synchronousReactancePuXq,
      transientReactancePuXdPrime,
      transientReactancePuXqPrime,
      subtransientReactancePuXdPrimePrime,
      subtransientReactancePuXqPrimePrime,
      transientOCTimeConstantSecondsTd0Prime,
      transientOCTimeConstantSecondsTq0Prime,
      subtransientOCTimeConstantSecondsTd0PrimePrime,
      subtransientOCTimeConstantSecondsTq0PrimePrime,
      statorLeakageInductancePuXl,
      statorResistancePuRa,
      inertiaMJMVAH,
      poles,
      speed,
      frequency,
    });

    // Connect to MongoDB
    await connect();

    // Create and save the new generator document
    const newGenerator = new Generator({
      location,
      circuitBreakerStatus,
      busTo,
      busSectionTo,
      type,
      rotor,
      mw,
      mva,
      kv,
      synchronousReactancePuXd,
      synchronousReactancePuXq,
      transientReactancePuXdPrime,
      transientReactancePuXqPrime,
      subtransientReactancePuXdPrimePrime,
      subtransientReactancePuXqPrimePrime,
      transientOCTimeConstantSecondsTd0Prime,
      transientOCTimeConstantSecondsTq0Prime,
      subtransientOCTimeConstantSecondsTd0PrimePrime,
      subtransientOCTimeConstantSecondsTq0PrimePrime,
      statorLeakageInductancePuXl,
      statorResistancePuRa,
      inertiaMJMVAH,
      poles,
      speed,
      frequency,
    });

    await newGenerator.save();

    // Respond with the newly created generator object
    return NextResponse.json(
      { message: 'Generator created successfully', generator: newGenerator },
      { status: 201 }
    );
  } catch (error) {
    // Catch any errors during the process
    console.error('Error creating generator:', error);
    return NextResponse.json(
      { error: 'Failed to create generator', details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all generators
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connect();

    // Fetch all generators from the database
    const generators = await Generator.find();

    // If no generators found, respond with a 404
    if (!generators || generators.length === 0) {
      return NextResponse.json(
        { error: 'No generators found' },
        { status: 404 }
      );
    }

    // Respond with the list of generators
    return NextResponse.json(
      { generators }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching generators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generators', details: error.message },
      { status: 500 }
    );
  }
}
