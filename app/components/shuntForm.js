"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ShuntEditForm() {
  const [shunt, setShunt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchShunt = async () => {
      if (!id) {
        setError("Shunt ID is missing");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      console.log("Fetching shunt data for ID:", id);
      console.log("Request URL:", `/api/shunt-fact/${id}`);

      try {
        const response = await fetch(`/api/shunt-fact/${id}`, {
          method: "GET", // Explicitly specify the method
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok) {
          setShunt(data.shunt.shunt || "");
        } else {
          setError(data.message || "Failed to fetch Shunt data");
        }
      } catch (error) {
        console.error("Error fetching shunt data:", error);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchShunt();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/shunt-fact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shunt }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/shunt-fact");
      } else {
        setError(data.message || "Failed to update Shunt");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/shunt-fact");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="m-4 font-bold text-3xl">
      <h1 className="text-3xl text-gray-500 font-bold mb-4">
        Edit Shunt Fact: <span className="font-semibold text-black text-xl">{id}</span>
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="shuntName" className="text-base font-normal mb-2">
            Shunt Fact Name
          </label>
          <input
            type="text"
            id="shuntName"
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
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}