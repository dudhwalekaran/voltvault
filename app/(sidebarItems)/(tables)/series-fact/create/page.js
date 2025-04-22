"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SeriesFactCreate() {
  const [series, setSeries] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedSeries = series.trim();
    if (!trimmedSeries) {
      setError("Series fact is required");
      setLoading(false);
      return;
    }
    if (trimmedSeries.length < 3) {
      setError("Series fact must be at least 3 characters");
      setLoading(false);
      return;
    }

    const seriesData = { series: trimmedSeries };
    console.log("Sending data to API:", seriesData);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/series-fact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(seriesData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.success) {
        alert(data.message || "Series Fact created successfully!");
        setSeries("");
        router.push("/series-fact");
      } else {
        setError(data.error || "Failed to create Series Fact");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Failed to create Series Fact due to a network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Series Fact</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="series" className="text-base font-normal mb-2">
            Series Fact
          </label>
          <input
            type="text"
            id="series"
            placeholder="Series Fact"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            required
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
          <Link href="/series-fact">
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