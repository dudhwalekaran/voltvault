"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [dataTypeFilter, setDataTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchHistory();
  }, [currentPage, search, actionFilter, dataTypeFilter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in to view history");

      const queryParams = new URLSearchParams({
        adminName: search,
        action: actionFilter,
        dataType: dataTypeFilter,
        page: currentPage,
        limit: itemsPerPage,
      });

      const response = await fetch(`/api/history?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      setHistory(data.history);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-2">
      <h1 className="text-4xl font-bold mb-4">Edit history</h1>

      {/* Search and Filters */}
      <div className="flex justify-between mb-4 space-x-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded-3xl bg-[#F3F4F6] w-1/3"
        />
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded"
        >
          <option value="All">Operation type: All</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="reject">Reject</option>
        </select>
        <select
          value={dataTypeFilter}
          onChange={(e) => {
            setDataTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded"
        >
          <option value="All">Select database: All</option>
          <option value="Bus">Bus</option>
          <option value="Load">Load</option>
          <option value="Generator">Generator</option>
          <option value="Shunt Capacitor">Shunt Capacitor</option>
          <option value="Reactor">Reactor</option>
        </select>
      </div>

      {/* Record Count and Pagination */}
      <div className="flex justify-between mb-4">
        <p className="text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-gray-200" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* History Logs */}
      {history.length === 0 ? (
        <p className="text-gray-500">No history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={entry._id}
              className="p-4 border rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">CN</span>
                <div>
                  <p className="text-lg font-semibold">
                    Changes made by {entry.adminName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {entry.adminEmail} | {entry.action.toUpperCase()}
                  </p>
                  <p className="text-gray-600 mt-1">{entry.details}</p>
                </div>
              </div>
              <p className="text-gray-500">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}