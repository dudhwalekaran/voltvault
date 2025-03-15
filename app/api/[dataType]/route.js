import { NextResponse } from "next/server";
import connect from "@/lib/db";
import History from "@/app/models/History";
import jwt from "jsonwebtoken";

// Dynamically import the correct model based on dataType
const models = {
  bus: require("@/models/Bus").default,
  load: require("@/models/Load").default,
  generator: require("@/models/Generator").default,
  "shuntcapacitor": require("@/models/shuntCapacitor").default,
  reactor: require("@/models/Reactor").default,
};

export async function POST(req, { params }) {
  try {
    const dataType = params.dataType.toLowerCase();
    const Model = models[dataType];
    if (!Model) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    const { ...data } = await req.json().catch(() => ({}));
    if (!Object.values(data).every((val) => val)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.status !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

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

    return NextResponse.json({ message: `${dataType} created successfully`, record: newRecord }, { status: 201 });
  } catch (error) {
    console.error(`Error creating ${params.dataType}:`, error.message);
    return NextResponse.json({ error: `Failed to create ${params.dataType}`, details: error.message }, { status: 500 });
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
    return NextResponse.json({ error: `Failed to update ${params.dataType}`, details: error.message }, { status: 500 });
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
    return NextResponse.json({ error: `Failed to delete ${params.dataType}`, details: error.message }, { status: 500 });
  }
}