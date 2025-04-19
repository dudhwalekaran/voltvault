"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ShuntReactorEdit() {
  const router = useRouter();
  const { id } = useParams();

  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    location: "",
    circuitBreaker: false,
    busFrom: "",
    busSectionFrom: "",
    kv: "",
    mva: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShuntReactor = async () => {
      if (!id) {
        setError("No ID provided for editing");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        console.log("Fetching data for ID:", id); // Debug log
        const response = await fetch(`/api/shunt-reactor/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (!data.success || !data.shuntReactor) {
          throw new Error("Shunt Reactor not found.");
        }

        setOriginalData(data.shuntReactor);
        setFormData({
          location: data.shuntReactor.location || "",
          circuitBreaker: data.shuntReactor.circuitBreaker || false,
          busFrom: data.shuntReactor.busFrom || "",
          busSectionFrom: data.shuntReactor.busSectionFrom || "",
          kv: data.shuntReactor.kv || "",
          mva: data.shuntReactor.mva || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShuntReactor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const updateData = {};
      for (const key in formData) {
        if (formData[key] !== originalData[key]) {
          updateData[key] = formData[key];
        }
      }

      if (Object.keys(updateData).length === 0) {
        alert("No changes detected.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/shunt-reactor/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update Shunt Reactor.");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update Shunt Reactor.");
      }

      alert("Shunt Reactor updated successfully!");
      router.push("/shunt-reactor");
    } catch (error) {
      console.error("Error updating Shunt Reactor:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 font-semibold text-lg">
      <h1 className="text-xl font-bold">Edit Shunt Reactor</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-blue-500 text-sm">Loading...</p>
      ) : (
        <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
          {[
            { label: "Location", name: "location" },
            { label: "Bus From", name: "busFrom" },
            { label: "Bus Section From", name: "busSectionFrom" },
            { label: "KV", name: "kv" },
            { label: "MVA", name: "mva" },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="text-xs font-medium mb-1">
                {label}
              </label>
              <input
                type="text"
                id={name}
                name={name}
                placeholder={`Enter ${label}`}
                className="p-2 border border-gray-300 text-sm rounded-lg"
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="circuitBreaker" className="text-xs font-medium mb-1">
              Circuit Breaker
            </label>
            <input
              type="checkbox"
              id="circuitBreaker"
              name="circuitBreaker"
              checked={formData.circuitBreaker}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          <div className="col-span-2 flex space-x-4 mt-5">
            <button
              type="submit"
              className="bg-blue-600 text-white w-56 text-sm py-2 px-4 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/shunt-reactor")}
              className="bg-red-500 text-white w-56 text-sm py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}