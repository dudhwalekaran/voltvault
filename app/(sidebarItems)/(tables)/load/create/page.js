"use client";

import { useState } from "react";
import Link from "next/link";

export default function BusCreate() {
  const [location, setLocation] = useState("");
  const [circuitBreaker, setCircuitBreaker] = useState(false); // Default to false
  const [busFrom, setBusFrom] = useState("");
  const [busSectionFrom, setBusSectionFrom] = useState("");
  const [pmw, setPmw] = useState(""); // Keep as string, handle as a number later
  const [qmvar, setQmvar] = useState(""); // Keep as string, handle as a number later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate that all required fields are filled
    if (
      !location ||
      !busFrom ||
      !busSectionFrom ||
      pmw === "" ||
      qmvar === ""
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const loadData = {
        location,
        circuitBreaker,
        busFrom,
        busSectionFrom,
        pmw,
        qmvar,
      };
      console.log("Sending data to API:", loadData);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("/api/load", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loadData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert(data.message); // Role-specific message from backend
        setLocation("");
        setCircuitBreaker(false); // Reset circuit to false
        setBusFrom("");
        setBusSectionFrom("");
        setPmw(""); // Reset pmw to empty string
        setQmvar(""); // Reset qmvar to empty string
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError(error.message || "Failed to create Load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <h1>Create New Load</h1>
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
          <label htmlFor="circuit" className="text-sm mb-2">
            Circuit Breaker Status
          </label>

          <div className="relative inline-block w-12 h-6 align-middle select-none">
            <input
              type="checkbox"
              id="circuit"
              className="absolute block w-6 h-6 bg-white border-2 rounded-full appearance-none cursor-pointer peer focus:outline-none"
              checked={circuitBreaker}
              onChange={(e) => setCircuitBreaker(e.target.checked)}
            />
            <label
              htmlFor="circuit"
              className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-500 peer-checked:after:translate-x-6 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0 after:left-0 after:w-6 after:h-6 after:bg-gray-100 after:border-2 after:rounded-full after:transition-all"
            ></label>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="busFrom" className="text-sm font-medium mb-2">
            Bus (From)
          </label>
          <input
            type="text"
            id="busFrom"
            placeholder="Enter TATA_Bus_1"
            className="p-2 border border-gray-300 font-normal text-sm rounded-lg"
            value={busFrom}
            onChange={(e) => setBusFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionFrom" className="text-sm font-medium mb-2">
            Bus Section (From)
          </label>
          <input
            type="text"
            id="busSectionFrom"
            placeholder="Bus Section (From)"
            className="p-2 border border-gray-300 font-normal text-sm rounded-lg"
            value={busSectionFrom}
            onChange={(e) => setBusSectionFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="pmw" className="text-sm font-medium mb-2">
            P (MW)
          </label>
          <input
            type="number"
            id="pmw"
            placeholder="P (MW)"
            className="p-2 border border-gray-300 font-normal text-sm rounded-lg"
            value={pmw}
            onChange={(e) =>
              setPmw(e.target.value ? parseFloat(e.target.value) : "")
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="qmvar" className="text-sm font-medium mb-2">
            Q (Mvar)
          </label>
          <input
            type="number"
            id="qmvar"
            placeholder="Q (Mvar)"
            className="p-2 border border-gray-300 font-normal text-sm rounded-lg"
            value={qmvar}
            onChange={(e) =>
              setQmvar(e.target.value ? parseFloat(e.target.value) : "")
            }
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
          <Link href="/load">
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
