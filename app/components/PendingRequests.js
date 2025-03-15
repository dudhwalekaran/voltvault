"use client";

import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false); // Track user role
  const itemsPerPage = 5;

  useEffect(() => {
    // Check user role from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.status === "admin") {
      setIsAdmin(true);
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in to view requests");

      const response = await fetch("/api/pending-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch requests");
      }

      if (!Array.isArray(data.pendingRequests)) {
        throw new Error("Invalid response format from API");
      }

      setRequests(data.pendingRequests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function updateRequestStatus(id, newStatus) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in to perform this action");

      const response = await fetch(`/api/update-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      await fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      setError(error.message);
    }
  }

  const filteredRequests = requests.filter((req) => {
    return (
      req.username.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || req.status === statusFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-2">
      <h1 className="text-4xl font-bold mb-4">
        Users' Requests for Changes in Data
      </h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-3xl bg-[#F3F4F6] w-3/4"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {paginatedRequests.length === 0 ? (
        <p className="text-gray-500">No matching requests found.</p>
      ) : (
        <div className="space-y-4 max-w-full">
          {paginatedRequests.map((req) => (
            <div
              key={req._id}
              className="p-4 border rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{req.username}</p>
                <p className="text-sm text-gray-500">{req.email}</p>
                <p className="text-gray-600 mt-2">{req.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    req.status === "pending"
                      ? "bg-yellow-500"
                      : req.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
                {req.status === "pending" && isAdmin ? (
                  <>
                    <button
                      onClick={() => updateRequestStatus(req._id, "approved")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req._id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </>
                ) : req.status === "pending" ? (
                  <span className="text-gray-500">Awaiting admin review</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            ⬅️ Prev
          </button>
          <span className="px-3 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}