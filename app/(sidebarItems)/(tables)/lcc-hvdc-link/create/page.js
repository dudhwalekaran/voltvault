"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LccCreate() {
  const [lcc, setLcc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const lccData = { lcc };
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("/api/lcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lccData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Lcc created successfully!");
        setLcc("");
        router.push("/lcc-hvdc-link");
      } else {
        setError(data.error || "Failed to create Lcc");
      }
    } catch (error) {
      setError(error.message || "Failed to create Lcc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Lcc</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="lcc" className="text-base font-normal mb-2">
            Lcc
          </label>
          <input
            type="text"
            id="lcc"
            placeholder="Lcc-hvdc-link"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={lcc}
            onChange={(e) => setLcc(e.target.value)}
            disabled={loading}
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
          <Link href="/lcc-hvdc-link">
            <button
              type="button"
              className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}