"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateVscPage() {
  const [vscFact, setVscFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const vscData = { vscFact };
    console.log("Sending data to API:", vscData);

    const token = localStorage.getItem("authToken");
    console.log("Token from localStorage:", token);
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/vsc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vscData),
      });

      // Log everything about the response
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);
      console.log("Response Headers:", [...response.headers.entries()]);

      const data = await response.json();
      console.log("Parsed API Response:", data);

      if (response.ok) {
        console.log("Success path triggered!");
        alert(data.message || "VSC Fact created successfully!");
        setVscFact("");
        router.push("/vsc-hvdc-link");
      } else {
        console.log("Error path triggered!");
        setError(data.error || `Failed to create VSC Fact (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to create VSC Fact due to a network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create VSC Fact</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="vscFact" className="text-base font-normal mb-2">
            VSC Fact
          </label>
          <input
  type="number"
  id="vscFact"
  placeholder="VSC Fact"
  className="p-2 border border-gray-300 font-semibold text-base rounded-lg"
  value={vscFact}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setVscFact(value);
    }
  }}
  required
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
          <Link href="/vsc-hvdc-link">
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
