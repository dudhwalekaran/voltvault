"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadEdit({ id }) {
  const [loadData, setLoadData] = useState({
    location: "",
    circuitBreaker: false,
    busFrom: "",
    busSectionFrom: "",
    pmw: "",
    qmvar: "",
  });

  const [initialLoadData, setInitialLoadData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        const response = await fetch(`/api/load/${id}`);
        if (!response.ok) throw new Error("Failed to fetch load data");
        const data = await response.json();

        if (data.success && data.load) {
          setLoadData({
            location: data.load.location || "",
            circuitBreaker: data.load.circuitBreaker || false,
            busFrom: data.load.busFrom || "",
            busSectionFrom: data.load.busSectionFrom || "",
            pmw: data.load.pmw !== undefined ? data.load.pmw : "",
            qmvar: data.load.qmvar !== undefined ? data.load.qmvar : "",
          });

          setInitialLoadData({
            location: data.load.location || "",
            circuitBreaker: data.load.circuitBreaker || false,
            busFrom: data.load.busFrom || "",
            busSectionFrom: data.load.busSectionFrom || "",
            pmw: data.load.pmw !== undefined ? data.load.pmw : "",
            qmvar: data.load.qmvar !== undefined ? data.load.qmvar : "",
          });
        } else {
          setError("Load data not found");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (id) fetchLoad();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoadData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get only changed fields
    const updatedFields = Object.fromEntries(
      Object.entries(loadData).filter(
        ([key, value]) => value !== initialLoadData[key]
      )
    );

    if (Object.keys(updatedFields).length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/load/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) throw new Error("Failed to update load");
      router.push("/load");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4">
      <h1 className="text-2xl text-gray-500 font-bold mb-4">
        Edit Load: <span className="font-semibold text-black">{id}</span>
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        className="grid grid-cols-2 gap-4 mt-6 text-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-base font-normal mb-2">Location</label>
          <input
            type="text"
            name="location"
            className="p-2 border border-gray-300 text-sm rounded-lg"
            value={loadData.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-base font-normal">Circuit Breaker</label>
          <input
            type="checkbox"
            name="circuitBreaker"
            checked={loadData.circuitBreaker}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-base font-normal mb-2">Bus (From)</label>
          <input
            type="text"
            name="busFrom"
            className="p-2 border border-gray-300 text-sm rounded-lg"
            value={loadData.busFrom}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-base font-normal mb-2">
            Bus Section (From)
          </label>
          <input
            type="text"
            name="busSectionFrom"
            className="p-2 border border-gray-300 text-sm rounded-lg"
            value={loadData.busSectionFrom}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-base font-normal mb-2">P (MW)</label>
          <input
            type="number"
            name="pmw"
            className="p-2 border border-gray-300 text-sm rounded-lg"
            value={loadData.pmw}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-base font-normal mb-2">Q (Mvar)</label>
          <input
            type="number"
            name="qmvar"
            className="p-2 border border-gray-300 text-sm rounded-lg"
            value={loadData.qmvar}
            onChange={handleChange}
          />
        </div>

        <div className="flex space-x-4 mt-5">
          <button
            type="submit"
            className="bg-blue-600 text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="bg-red-600 text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-700"
            onClick={() => router.push("/load")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
