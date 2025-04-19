"use client";

import { useState } from "react";
import Link from "next/link";

export default function ShuntFactCreate() {
  const [shunt, setShunt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const shuntData = { shunt };
    console.log("Sending data to API:", shuntData);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/shunt-fact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shuntData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert(data.message || "Shunt Fact created successfully!");
        setShunt("");
      } else {
        setError(data.error || "Failed to create Shunt Fact");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Failed to create Shunt Fact due to a network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Shunt Fact</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="shunt" className="text-base font-normal mb-2">
            Shunt Fact
          </label>
          <input
            type="text"
            id="shunt"
            placeholder="Shunt Fact"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={shunt}
            onChange={(e) => setShunt(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 col-span-2">{error}</p>
        )}

        <div className="flex space-x-4 mt-5 col-span-2">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <Link href="/shunt-fact">
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
