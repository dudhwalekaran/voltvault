"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LccForm({ id }) {
  const [lcc, setLcc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLcc = async () => {
      try {
        // Retrieve the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`/api/lcc/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch LCC data");
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch LCC data");
        }

        setLcc(data.lcc?.lcc || ""); // Ensure correct object structure
      } catch (error) {
        setError(error.message);
      }
    };
    fetchLcc();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Retrieve the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`/api/lcc/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
        body: JSON.stringify({ lcc }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update LCC");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update LCC");
      }

      router.push("/lcc-hvdc-link"); // Redirect after successful update
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1 className="text-3xl text-gray-500 font-bold mb-4">
        Edit Lcc: <span className="font-semibold text-black text-xl">{id}</span>
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="lccName" className="text-base font-normal mb-2">
            LCC Name
          </label>
          <input
            type="text"
            id="lccName"
            placeholder="Enter new LCC name"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={lcc}
            onChange={(e) => setLcc(e.target.value)}
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
            onClick={() => router.push("/lcc-hvdc-link")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}