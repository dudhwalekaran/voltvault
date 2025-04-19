"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateVsc() {
  const [vscFact, setVscFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please log in to create a VSC");
      }

      console.log("Sending POST request to /api/vsc with data:", { vscFact });
      const response = await fetch("/api/vsc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vscFact }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create VSC");
      }

      if (data.success) {
        setTimeout(() => {
          router.push("/vsc-hvdc-link"); // Redirect after 1.5 seconds
        }, 1500); // Redirect delay of 1.5 seconds
      } else {
        throw new Error(data.error || "Unexpected response format");
      }
    } catch (error) {
      console.error("Error creating VSC:", error.message);
      setError("Submission failed: " + error.message); // Display the error message
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Create VSC Fact</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="vscFact" className="block mb-2 text-lg">
            VSC Fact
          </label>
          <input
            type="text"
            id="vscFact"
            name="vscFact"
            value={vscFact}
            onChange={(e) => setVscFact(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Enter VSC Fact"
            required
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error display */}

        <div className="flex space-x-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"} {/* Display button text */}
          </button>
          <Link href="/vsc-hvdc-link">
            <button
              type="button"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
