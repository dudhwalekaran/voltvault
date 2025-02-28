"use client";

import { useState } from "react";
import Link from "next/link";

export default function BusCreate() {
  const [location, setLocation] = useState("");
  const [mvar, setMvar] = useState(""); // Default to false
  const [compensation, setCompensation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate that all required fields are filled
    if (
      !location ||
      !mvar ||
      !compensation
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const capacitorData = {
        location,
        mvar,
        compensation,
      };
      console.log("Sending data to API:", capacitorData);

      const response = await fetch("/api/series-capacitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(capacitorData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert("Series Capacitor created successfully!");
        setLocation("");
        setMvar(""); // Reset circuit to false
        setCompensation("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Failed to create bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <h1>Create Capacitor</h1>
      <form className="grid grid-cols-2 gap-4 mt-8" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="busName" className="text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="busName"
            placeholder="Enter Location"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busName" className="text-sm font-medium mb-2">
            Mvar
          </label>
          <input
            type="text"
            id="busName"
            placeholder="Mvar"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={mvar}
            onChange={(e) => setMvar(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busFrom" className="text-sm font-medium mb-2">
            Compensation
          </label>
          <input
            type="text"
            id="busFrom"
            placeholder="Enter TATA_Bus_1"
            className="p-2 border border-gray-300 font-normal text-sm rounded-lg"
            value={compensation}
            onChange={(e) => setCompensation(e.target.value)}
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
          <Link href="/series-capacitor">
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
