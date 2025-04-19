import { NextResponse } from "next/server";
import connect from "@/lib/db";
import TransformerThreeWinding from "@/models/transformersThreeWinding";
import History from "@/models/History";
import PendingRequest from "@/models/PendingRequest";
import jwt from "jsonwebtoken";

// POST method to create a new Transformer Three Winding
export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
      console.log("Received data:", body);
    } catch (error) {
      console.error("Body Parse Failed:", error.message);
      return NextResponse.json(
        { error: "Invalid request body", details: error.message },
        { status: 400 }
      );
    }

    const {
      location,
      circuitBreakerStatus,
      busprimaryFrom,
      busprimarySectionFrom,
      bussecondaryTo,
      busSectionSecondaryTo,
      bustertiaryTo,
      busSectionTertiaryTo,
      mva,
      kvprimaryVoltage,
      kvsecondaryVoltage,
      kvtertiaryVoltage,
      psprimarysecondaryR,
      psprimarysecondaryX,
      ptprimarytertiaryR,
      ptprimarytertiaryX,
      stsecondarytertiaryR,
      stsecondarytertiaryX,
      TapPrimary,
      TapSecondary,
      TapTertiary,
      primaryConnection,
      primaryConnectionGrounding,
      secondaryConnection,
      secondaryConnectionGrounding,
      tertiaryConnection,
      tertiaryConnectionGrounding,
    } = body;

    if (!location || !mva || !kvprimaryVoltage) {
      return NextResponse.json(
        { error: "Missing required fields: location, mva, and kvprimaryVoltage are required" },
        { status: 400 }
      );
    }

    await connect();

    const role = decoded.status;
    const transformerData = {
      location,
      circuitBreakerStatus,
      busprimaryFrom,
      busprimarySectionFrom,
      bussecondaryTo,
      busSectionSecondaryTo,
      bustertiaryTo,
      busSectionTertiaryTo,
      mva,
      kvprimaryVoltage,
      kvsecondaryVoltage,
      kvtertiaryVoltage,
      psprimarysecondaryR,
      psprimarysecondaryX,
      ptprimarytertiaryR,
      ptprimarytertiaryX,
      stsecondarytertiaryR,
      stsecondarytertiaryX,
      TapPrimary,
      TapSecondary,
      TapTertiary,
      primaryConnection,
      primaryConnectionGrounding,
      secondaryConnection,
      secondaryConnectionGrounding,
      tertiaryConnection,
      tertiaryConnectionGrounding,
      createdBy: decoded.userId, // Add for GET filtering
    };
    const description = `Add Transformer Three Winding: ${location}`;

    if (role === "admin") {
      const newTransformer = new TransformerThreeWinding(transformerData);
      await newTransformer.save();

      const history = new History({
        action: "create",
        dataType: "TransformerThreeWinding",
        recordId: newTransformer._id.toString(),
        adminEmail: decoded.email,
        adminName: decoded.name,
        details: `Created Transformer: ${JSON.stringify(transformerData)}`,
      });
      await history.save();
      console.log("History entry created:", history);

      return NextResponse.json(
        { success: true, message: "Transformer created successfully", transformer: newTransformer },
        { status: 201 }
      );
    } else if (role === "user") {
      const pendingRequest = new PendingRequest({
        dataType: "TransformerThreeWinding",
        data: transformerData,
        submittedBy: decoded.email,
        username: decoded.name,
        email: decoded.email,
        description,
        status: "pending",
      });
      await pendingRequest.save();
      return NextResponse.json(
        { success: true, message: "Request submitted for approval" },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Error creating Transformer Three Winding:", error);
    return NextResponse.json(
      { error: "Failed to create Transformer Three Winding", details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all Transformer Three Windings
export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided or incorrect format" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", details: error.message },
        { status: 401 }
      );
    }

    await connect();
    const transformers =
      decoded.status === "admin"
        ? await TransformerThreeWinding.find()
        : await TransformerThreeWinding.find({
            $or: [{ createdBy: decoded.userId }, { status: "approved" }],
          });

    if (!transformers || transformers.length === 0) {
      return NextResponse.json(
        { success: true, message: "No Transformer Three Windings found", transformers: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, transformers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Transformer Three Windings:", error);
    return NextResponse.json(
      { error: "Failed to fetch Transformer Three Windings", details: error.message },
      { status: 500 }
    );
  }
}