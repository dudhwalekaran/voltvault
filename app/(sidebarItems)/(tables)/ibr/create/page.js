"use client";

import { useState } from "react";
import Link from "next/link";

export default function IbrCreate() {
  const [ibr, setIbr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inside your IbrCreate Component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const ibrData = { ibr };
    console.log("Sending data to API:", ibrData); // Log data being sent

    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ibr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in header
        },
        body: JSON.stringify(ibrData), // Send data as JSON string
      });

      const data = await response.json(); // Parse the response as JSON
      console.log("API Response:", data); // Log the response data

      if (response.ok) {
        alert("IBR request send successfully!");
        // Optionally reset form fields
        setIbr("");
      } else {
        setError(data.error || "Failed to create IBR"); // Handle any error response
      }
    } catch (err) {
      console.error("Error during fetch:", err); // Log any fetch errors
      setError("Failed to create IBR due to a network error");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create IBR</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="ibr" className="text-base font-normal mb-2">
            IBR
          </label>
          <input
            type="text"
            id="ibr"
            placeholder="Enter IBR"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={ibr}
            onChange={(e) => setIbr(e.target.value)}
          />
        </div>
        
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex space-x-4 mt-5">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <Link href="/ibr">
            <button
              type="button"
              className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}