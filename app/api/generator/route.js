import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Generator from "@/models/Generator";
import History from "@/models/History";
import PendingRequest from "@/models/PendingRequest";
import jwt from "jsonwebtoken";

// POST method to create a new generator
export async function POST(req) {
  try {
    console.log("POST /api/generator called");

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      return NextResponse.json(
        { error: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

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

    console.log("Received data:", {
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

    if (!location) {
      console.log("Missing required field: location");
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    await connect();
    console.log("Database connected successfully");

    const role = decoded.status; // Extract role ("admin" or "user")
    const generatorData = {
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
    };
    const description = `Add Generator: ${location}`;

    if (role === "admin") {
      const newGenerator = new Generator(generatorData);
      await newGenerator.save();
      console.log("Generator created:", newGenerator);

      try {
        const history = new History({
          action: "create",
          dataType: "Generator",
          recordId: newGenerator._id.toString(),
          adminEmail: decoded.email || decoded.userId || "Unknown",
          adminName: decoded.username || decoded.name || "Unknown",
          details: `Created Generator: ${JSON.stringify(generatorData)}`,
        });
        await history.save();
        console.log("History entry created:", history);
      } catch (historyError) {
        console.error("Failed to create history entry:", historyError.message);
        // Continue with success response despite history logging failure
      }

      console.log("Returning admin success response:", { success: true, generator: newGenerator });
      return NextResponse.json(
        {
          success: true,
          message: "Generator created successfully",
          generator: newGenerator,
        },
        { status: 201 }
      );
    } else if (role === "user") {
      const pendingRequest = new PendingRequest({
        dataType: "Generator",
        data: generatorData,
        submittedBy: decoded.userId || decoded.email || "Unknown",
        username: decoded.username || decoded.name || "Unknown",
        email: decoded.email || "Unknown",
        description,
        status: "pending",
      });
      await pendingRequest.save();
      console.log("Pending request created:", pendingRequest);

      console.log("Returning user success response:", { success: true, message: "Request submitted for approval" });
      return NextResponse.json(
        {
          success: true,
          message: "Request submitted for approval",
          pendingRequest,
        },
        { status: 201 }
      );
    }

    console.log("Invalid role detected:", role);
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Error creating generator:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create generator", details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all generators
export async function GET(req) {
  try {
    console.log("GET /api/generator called");

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      return NextResponse.json(
        { error: "Invalid or expired token", details: error.message },
        { status: 401 }
      );
    }

    await connect();
    console.log("Database connected successfully");

    // Extract query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const status = url.searchParams.get("status"); // Optional filter

    // Build query
    let query = {};
    if (decoded.status !== "admin") {
      query = { status: "approved" }; // Non-admins only see approved generators
    }
    if (status) {
      query.status = status;
    }

    // Fetch generators with pagination and sorting
    const generators = await Generator.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    const total = await Generator.countDocuments(query);

    console.log(
      `Generators found: ${generators.length} (Page ${page}, Limit ${limit}, Total ${total})`
    );

    return NextResponse.json(
      {
        success: true,
        message: generators.length === 0 ? "No generators found" : undefined,
        generators,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching generators:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch generators", details: error.message },
      { status: 500 }
    );
  }
}