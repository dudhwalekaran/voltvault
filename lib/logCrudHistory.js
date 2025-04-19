import connectDB from "@/lib/db";
import History from "@/models/History";
import jwt from "jsonwebtoken";

const logCrudHistory = (operation, resource) => {
  return async (req, res) => {
    try {
      await connectDB();

      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return; // Skip logging if unauthorized
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the resource ID from the request (e.g., from params or body)
      let resourceId = null;
      if (req.method === "POST") {
        // For create operations, the resourceId will be set after the operation
        resourceId = res?.resourceId || null;
      } else if (req.method === "GET" || req.method === "PUT" || req.method === "DELETE") {
        // For read, update, delete, the ID might be in the URL params
        const url = new URL(req.url, `http://${req.headers.get("host")}`);
        const id = url.pathname.split("/").pop(); // Extract ID from URL (e.g., /api/bus/123)
        resourceId = id || null;
      }

      // Log the operation to history
      const historyEntry = new History({
        userEmail: decoded.email,
        userName: decoded.name,
        operation,
        resource,
        resourceId,
        details: `User ${decoded.email} performed ${operation} on ${resource}${
          resourceId ? ` with ID ${resourceId}` : ""
        }`,
        timestamp: new Date(),
      });

      await historyEntry.save();
      console.log("History logged:", { userEmail: decoded.email, operation, resource });
    } catch (error) {
      console.error("Error logging CRUD history:", error.message, error.stack);
    }
  };
};

export default logCrudHistory;