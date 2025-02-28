"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CapacitorEdit() {
  const router = useRouter();
  const { id } = useParams();

  // Store original capacitor data
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    location: "",
    mvar: "",
    compensation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch capacitor data when component mounts
  useEffect(() => {
    const fetchCapacitor = async () => {
      try {
        const response = await fetch(`/api/series-capacitor/${id}`);
        const data = await response.json();

        if (data.success) {
          setOriginalData(data.capacitor); // Store original data
          setFormData({
            location: data.capacitor.location || "",
            mvar: data.capacitor.mvar || "",
            compensation: data.capacitor.compensation || "",
          });
        } else {
          setError("Capacitor not found.");
        }
      } catch (error) {
        console.error("Error fetching capacitor:", error);
        setError("Failed to load capacitor data.");
      }
    };

    if (id) fetchCapacitor();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Compare current form data with original data and send only changed fields
      const updateData = {};
      for (const key in formData) {
        if (formData[key] !== originalData[key]) {
          updateData[key] = formData[key];
        }
      }

      // If no changes were made, stop the update
      if (Object.keys(updateData).length === 0) {
        alert("No changes detected.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/series-capacitor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Capacitor updated successfully!");
        router.push("/series-capacitor");
      } else {
        setError(data.message || "Failed to update capacitor.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update capacitor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <h1>Edit Capacitor</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form className="grid grid-cols-2 gap-4 mt-8" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="location" className="text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter Location"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mvar" className="text-sm font-medium mb-2">
            Mvar
          </label>
          <input
            type="text"
            id="mvar"
            name="mvar"
            placeholder="Mvar"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.mvar}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="compensation" className="text-sm font-medium mb-2">
            Compensation
          </label>
          <input
            type="text"
            id="compensation"
            name="compensation"
            placeholder="Enter Compensation"
            className="p-2 border border-gray-300 font-normal text-sm rounded-lg"
            value={formData.compensation}
            onChange={handleChange}
          />
        </div>

        <div className="flex space-x-4 mt-5">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/series-capacitor")}
            className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
