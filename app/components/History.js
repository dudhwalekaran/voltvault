"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dataTypeFilter, setDataTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const entriesPerPage = 10;

  // Fetch history from the API with pagination
  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view history");
        return;
      }

      const response = await fetch(`/api/history?page=${page}&limit=${entriesPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      const historyData = data.history || [];
      setHistory(historyData);
      setTotalEntries(data.totalEntries || 0);
      setTotalPages(Math.ceil((data.totalEntries || 0) / entriesPerPage));
      setCurrentPage(page);

      if (dataTypeFilter === "all") {
        setFilteredHistory(historyData);
      } else {
        setFilteredHistory(historyData.filter((entry) => entry.dataType.toLowerCase() === dataTypeFilter));
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a history entry
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this history entry?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to delete history");
        return;
      }

      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete history entry");
      }

      const newTotalEntries = totalEntries - 1;
      const newTotalPages = Math.ceil(newTotalEntries / entriesPerPage);
      const adjustedPage = Math.min(currentPage, newTotalPages || 1);
      await fetchHistory(adjustedPage);
    } catch (err) {
      console.error("Error deleting history entry:", err);
      setError(err.message);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    fetchHistory(1);
  }, []);

  // Update filtered history when the filter changes
  useEffect(() => {
    if (dataTypeFilter === "all") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter((entry) => entry.dataType.toLowerCase() === dataTypeFilter));
    }
  }, [dataTypeFilter, history]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || loading) return;
    fetchHistory(page);
  };

  // Format the details based on action type
  const formatDetails = (action, dataType, recordId) => {
    if (action === "create") {
      return `New record added to ${dataType} with ID ${recordId}.`;
    } else if (action === "update") {
      return `Record modified in ${dataType} with ID ${recordId}.`;
    } else if (action === "delete") {
      return `Record deleted from ${dataType} with ID ${recordId}.`;
    }
    return "Unknown action.";
  };

  // Get initials from admin name
  const getInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].slice(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  // Format the title based on the action and data type
  const formatTitle = (action, dataType, adminName) => {
    return `Changes made by ${adminName} in ${dataType}`;
  };

  // Get unique data types for the filter dropdown
  const dataTypes = ["all", ...new Set(history.map((entry) => entry.dataType.toLowerCase()))];

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit History</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="dataTypeFilter" className="text-sm font-medium text-gray-700">
              Filter by Data Type:
            </label>
            <select
              id="dataTypeFilter"
              value={dataTypeFilter}
              onChange={(e) => setDataTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All" : type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => fetchHistory(currentPage)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * entriesPerPage + 1, totalEntries)} to{" "}
          {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} records
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              currentPage === 1 || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            &lt;
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const startPage = Math.max(1, currentPage - 2);
            const page = startPage + i;
            return page <= totalPages ? (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={loading}
              >
                {page}
              </button>
            ) : null;
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              currentPage === totalPages || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>

      {loading && !error && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading history...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={() => fetchHistory(currentPage)}
            className="mt-3 text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filteredHistory.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 border border-gray-200 rounded-lg">
          <p className="text-gray-600 font-medium">No history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((entry) => (
            <div
              key={entry._id}
              className="flex items-start p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                    {getInitials(entry.adminName)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      {formatTitle(entry.action, entry.dataType, entry.adminName)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      ,{" "}
                      {new Date(entry.timestamp).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {entry.adminEmail} |{" "}
                    <span
                      className={`font-medium ${
                        entry.action === "create"
                          ? "text-green-600"
                          : entry.action === "update"
                          ? "text-blue-600"
                          : entry.action === "delete"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {formatDetails(entry.action, entry.dataType, entry.recordId)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry._id)}
                className="ml-4 text-gray-500 hover:text-red-600 transition"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}