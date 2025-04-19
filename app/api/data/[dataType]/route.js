import { NextResponse } from "next/server";
import connect from "@/lib/db";
import PendingRequest from "@/models/PendingRequest";
import History from "@/models/History";
import jwt from "jsonwebtoken";
import SingleLineDiagram from "@/models/SingleLineDiagram";
import TransformerThreeWinding from "@/app/components/transformerThreeWinding";
import TransformerTwoWinding from "@/app/components/transformerTwoWinding";
import Turbine from "@/models/Turbine";
import Lcc from "@/models/Lcc-hvdc-link";
import Vsc from "@/models/Vsc-hvdc-link";

// Dynamic model loading for all data types
const models = {
  bus: require("@/models/Bus").default,
  ibr: require("@/models/Ibr").default,
  load: require("@/models/Load").default,
  generator: require("@/models/Generator").default,
  excitation: require("@/models/ExcitationSystem").default,
  seriesCapacitor: require("@/models/seriesCapacitor").default,
  shuntCapacitor: require("@/models/shuntCapacitor").default,
  shuntReactor: require("@/models/shuntReactor").default,
  SingleLineDiagram: require("@/models/SingleLineDiagram").default,
  TransformerThreeWinding: require("@/models/transformersThreeWinding").default,
  TransformerTwoWinding: require("@/models/transformer-two-winding").default,
  Turbine: require("@/models/Turbine").default,
  ibr: require("@/models/Ibr").default,
  Lcc: require("@/models/Lcc-hvdc-link").default,
  seriesFact: require("@/models/seriesFact").default,
  shuntFact: require("@/models/shuntFact").default,
  Vsc: require("@/models/Vsc-hvdc-link").defualt,
  // Add other data types as needed
};

export async function POST(req, { params }) {
  try {
    const dataType = params.dataType.toLowerCase();
    const Model = models[dataType];
    if (!Model) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    const data = await req.json().catch(() => ({}));
    if (!Object.values(data).every((val) => val != null && val !== "")) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug: Log the decoded token
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Ensure role exists and normalize to lowercase for comparison
    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    console.log("User role:", role); // Debug: Log the role

    const description = `Add ${dataType.charAt(0).toUpperCase() + dataType.slice(1)}: ${
      data.name || data.busName || JSON.stringify(data)
    }`;

    if (role === "admin") {
      console.log(`Admin role detected, creating ${dataType} directly`);
      const newRecord = new Model(data);
      await newRecord.save();

      const history = new History({
        action: "create",
        dataType: dataType.charAt(0).toUpperCase() + dataType.slice(1),
        recordId: newRecord._id.toString(),
        adminEmail: decoded.email,
        adminName: decoded.name,
        details: `Created ${dataType}: ${JSON.stringify(data)}`,
      });
      await history.save();

      return NextResponse.json(
        { message: `${dataType} created successfully`, record: newRecord },
        { status: 201 }
      );
    } else if (role === "user") {
      console.log(`User role detected, saving ${dataType} to PendingRequest`);
      const pendingRequest = new PendingRequest({
        dataType: dataType.charAt(0).toUpperCase() + dataType.slice(1),
        data,
        submittedBy: decoded.email,
        username: decoded.name,
        email: decoded.email,
        description,
        status: "pending",
      });
      await pendingRequest.save();
      return NextResponse.json({ message: "Request submitted for approval" }, { status: 201 });
    } else {
      console.log("Invalid role detected:", role);
      return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error creating ${params.dataType}:`, error.message);
    return NextResponse.json(
      { error: `Failed to create ${params.dataType}`, details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const dataType = params.dataType.toLowerCase();
    const Model = models[dataType];
    if (!Model) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    await connect();
    const records = await Model.find();
    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching ${params.dataType}:`, error.message);
    return NextResponse.json(
      { error: `Failed to fetch ${params.dataType}`, details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const dataType = params.dataType.toLowerCase();
    const Model = models[dataType];
    if (!Model) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    const { id } = params;
    const updateData = await req.json();

    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token in PATCH:", decoded); // Debug: Log the decoded token
    } catch (error) {
      console.error("JWT verification failed in PATCH:", error.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.status.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const record = await Model.findById(id);
    if (!record) {
      return NextResponse.json({ error: `${dataType} not found` }, { status: 404 });
    }

    const changes = [];
    for (const key in updateData) {
      if (record[key] !== updateData[key]) {
        changes.push(`${key} changed from ${record[key]} to ${updateData[key]}`);
      }
    }

    await Model.findByIdAndUpdate(id, updateData);

    if (changes.length > 0) {
      const history = new History({
        action: "update",
        dataType: dataType.charAt(0).toUpperCase() + dataType.slice(1),
        recordId: id,
        adminEmail: decoded.email,
        adminName: decoded.name,
        details: `Record with ID ${id} was updated. ${changes.join(", ")}`,
      });
      await history.save();
    }

    return NextResponse.json({ message: `${dataType} updated successfully` }, { status: 200 });
  } catch (error) {
    console.error(`Error updating ${params.dataType}:`, error.message);
    return NextResponse.json(
      { error: `Failed to update ${params.dataType}`, details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const dataType = params.dataType.toLowerCase();
    const Model = models[dataType];
    if (!Model) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    const { id } = params;

    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token in DELETE:", decoded); // Debug: Log the decoded token
    } catch (error) {
      console.error("JWT verification failed in DELETE:", error.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.status.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const record = await Model.findById(id);
    if (!record) {
      return NextResponse.json({ error: `${dataType} not found` }, { status: 404 });
    }

    await Model.findByIdAndDelete(id);

    const history = new History({
      action: "delete",
      dataType: dataType.charAt(0).toUpperCase() + dataType.slice(1),
      recordId: id,
      adminEmail: decoded.email,
      adminName: decoded.name,
      details: `Deleted ${dataType}: ${JSON.stringify(record)}`,
    });
    await history.save();

    return NextResponse.json({ message: `${dataType} deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting ${params.dataType}:`, error.message);
    return NextResponse.json(
      { error: `Failed to delete ${params.dataType}`, details: error.message },
      { status: 500 }
    );
  }
}