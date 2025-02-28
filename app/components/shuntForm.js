"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShuntEditForm({ id }) {
  const [shunt, setShunt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShunt = async () => {
      try {
        const response = await fetch(`/api/shunt-fact/${id}`);
        if (!response.ok) throw new Error("Failed to fetch Shunt data");
        const data = await response.json();
        setShunt(data.shunt?.shunt || ""); // Ensure correct object structure
      } catch (error) {
        setError(error.message);
      }
    };
    fetchShunt();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/shunt-fact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shunt }),
      });

      if (!response.ok) throw new Error("Failed to update Series Fact");
      router.push("/shunt-fact"); // Redirect after successful update
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1 className="text-3xl text-gray-500 font-bold mb-4">
        Edit Shunt Fact: <span className="font-semibold text-black text-xl">{id}</span>
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="vscName" className="text-base font-normal mb-2">Shunt Fact Name</label>
          <input
            type="text"
            id="vscName"
            placeholder="Enter new Shunt name"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={shunt}
            onChange={(e) => setShunt(e.target.value)}
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
            className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-600"
            onClick={() => router.push("/shunt-fact")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
