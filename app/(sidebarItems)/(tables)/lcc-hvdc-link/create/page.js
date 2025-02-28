"use client";

import { useState } from "react";
import Link from "next/link";

export default function BusCreate() {
  const [lcc, setLcc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inside your BusCreate Component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lccData = { lcc };
      console.log("Sending data to API:", lccData); // Log data being sent

      const response = await fetch("/api/lcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure content-type is set to JSON
        },
        body: JSON.stringify(lccData), // Send data as JSON string
      });

      const data = await response.json(); // Parse the response as JSON
      console.log("API Response:", data); // Log the response data

      if (response.ok) {
        alert("Lcc created successfully!");
        // Optionally reset form fields
        setLcc("");
      } else {
        setError(data.error); // Handle any error response
      }
    } catch (error) {
      console.error("Error during fetch:", error); // Log any fetch errors
      setError("Failed to create Lcc");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Lcc</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="busName" className="text-base font-normal mb-2">
            Lcc
          </label>
          <input
            type="text"
            id="busName"
            placeholder="Lcc-hvdc-link"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={lcc}
            onChange={(e) => setLcc(e.target.value)}
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
          <Link href="/lcc-hvdc-link">
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
