"use client";

import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
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
      if (!token) {
        alert("Please log in to view requests");
        return;
      }

      const response = await fetch("/api/pending-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to fetch requests");
        return;
      }

      if (!Array.isArray(data.pendingRequests)) {
        alert("Invalid response format from API");
        return;
      }

      setRequests(data.pendingRequests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function updateRequestStatus(id, newStatus) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to perform this action");
        return;
      }

      const response = await fetch(`/api/update-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to update request");
        return;
      }

      alert(`Request ${newStatus} successfully!`);
      await fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      alert(error.message);
    }
  }

  async function deleteRequest(id) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to perform this action");
        return;
      }

      const response = await fetch(`/api/update-request/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to delete request");
        return;
      }

      alert("Request deleted successfully!");
      await fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      alert(error.message);
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

  const getInitials = (name) => {
    const words = name.split(" ");
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`
      : name.slice(0, 2).toUpperCase();
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

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
              className="p-4 border rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {getInitials(req.username)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold">{req.username}</p>
                    <p className="text-sm text-gray-500">{req.email}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-sm text-gray-400">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateRequestStatus(req._id, "approved")}
                      className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req._id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteRequest(req._id)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                ) : req.status === "pending" ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                    Awaiting admin review
                  </span>
                ) : (
                  isAdmin && (
                    <button
                      onClick={() => deleteRequest(req._id)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                      Delete
                    </button>
                  )
                )}
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
