"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ShuntCapacitorEdit() {
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
    const fetchCapacitor = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/shunt-capacitor/${id}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (!data.success || !data.shunt) {
          throw new Error("Shunt Capacitor not found.");
        }

        setOriginalData(data.shunt);
        setFormData({
          location: data.shunt.location || "",
          circuitBreaker: data.shunt.circuitBreaker || false,
          busFrom: data.shunt.busFrom || "",
          busSectionFrom: data.shunt.busSectionFrom || "",
          kv: data.shunt.kv || "",
          mva: data.shunt.mva || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCapacitor();
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

      const response = await fetch(`/api/shunt-capacitor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to update.");

      alert("Shunt Capacitor updated successfully!");
      router.push("/shunt-capacitor");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 font-semibold text-lg">
      <h1 className="text-xl font-bold">Edit Shunt Capacitor</h1>

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
              onClick={() => router.push("/shunt-capacitor")}
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
