'use client';
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [databaseFilter, setDatabaseFilter] = useState("all");

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },  // Prevent caching
      });
      const data = await response.json();
      setHistory(data);  // Update state with the latest data
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();  // Fetch once on mount
    const interval = setInterval(fetchHistory, 5000);  // Auto-refresh every 5 seconds
    return () => clearInterval(interval);  // Cleanup interval on unmount
  }, []);

  const filteredHistory = history.filter((entry) => {
    const matchesSearch = entry.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || entry.action === actionFilter;
    const matchesDatabase =
      databaseFilter === "all" || entry.affected_section.toLowerCase().includes(databaseFilter);
    return matchesSearch && matchesAction && matchesDatabase;
  });

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-3">Edit History</h1>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-10 mb-6 mt-2">
        <div className="relative w-[37%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <p className="font-normal text-lg">Operation Type:</p>
            <select
              className="border border-gray-300 text-sm font-normal bg-[#Fff] px-4 py-2"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="created">Create</option>
              <option value="updated">Update</option>
              <option value="deleted">Delete</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="font-normal text-lg">Select Database:</p>
            <select
              className="border border-gray-300 text-sm font-normal bg-[#fff] px-2 py-2"
              value={databaseFilter}
              onChange={(e) => setDatabaseFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="bus">Bus</option>
              <option value="generator">Generator</option>
              <option value="transmission">Transmission Line</option>
              <option value="shunt-reactor">Shunt Reactor</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Cards Section */}
      <div className="space-y-6">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((entry) => (
            <div
              key={entry._id}
              className="p-5 bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">
                  Changes made by {entry.user_name} in {entry.affected_section}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{entry.user_email}</p>
              <p className="text-sm">
                Record with <span className="font-bold">ID {entry.affected_id}</span> was{" "}
                <span className="font-semibold">{entry.action}</span> from {entry.affected_section}.
              </p>
              <button className="text-red-500 text-sm font-medium">Delete</button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-xl">No activity found.</p>
        )}
      </div>
    </div>
  );
}
