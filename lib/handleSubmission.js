import PendingRequest from "@/models/PendingRequest";
import jwt from "jsonwebtoken";

export async function handleSubmission({ req, dataType, data, Model, description }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: { message: "Unauthorized: No token provided", status: 401 } };
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return { error: { message: "Invalid token", status: 401 } };
    }

    const role = decoded.status ? decoded.status.toLowerCase() : "unknown";
    if (role === "admin") {
      const newRecord = new Model(data);
      await newRecord.save();

      const history = new History({
        action: "create",
        dataType: dataType.toUpperCase(),
        recordId: newRecord._id.toString(),
        adminEmail: decoded.email,
        adminName: decoded.name,
        details: `Created ${dataType}: ${JSON.stringify(data)}`,
      });
      await history.save();

      return {
        success: {
          message: `${dataType} created successfully`, // Admin-specific message
          record: newRecord,
          status: 201,
        },
      };
    } else if (role === "user") {
      const pendingRequest = new PendingRequest({
        dataType: dataType.toUpperCase(),
        data,
        submittedBy: decoded.email,
        username: decoded.name,
        email: decoded.email,
        description,
        status: "pending",
      });
      await pendingRequest.save();
      return {
        success: {
          message: `${dataType} data request submitted successfully`, // User-specific message
          status: 201,
        },
      };
    } else {
      return { error: { message: `Invalid role: ${role}`, status: 400 } };
    }
  } catch (error) {
    return { error: { message: "Submission failed", status: 500 } };
  }
}