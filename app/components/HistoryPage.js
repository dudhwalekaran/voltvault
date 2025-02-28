'use client';

import React, { useEffect, useState } from "react";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",  // Prevent caching
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error("Failed to fetch history:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();  // Initial fetch
    const interval = setInterval(fetchHistory, 5000);  // Poll every 5 seconds
    return () => clearInterval(interval);  // Clean up interval
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Activity History</h2>
      {history.length === 0 ? (
        <p className="text-sm font-semibold">No activity found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold mr-3">
                {item.user_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold">
                  Changes made by {item.user_name} in {item.affected_section}
                </p>
                <p className="text-sm text-gray-600">{item.user_email}</p>
              </div>
              <div className="ml-auto text-gray-500 text-sm">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
            <p className="text-gray-700">
              Record with ID <span className="font-mono text-blue-500">{item.affected_id}</span> was{" "}
              <span className="font-semibold">{item.action}</span> from{" "}
              {item.affected_section}.
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPage;
