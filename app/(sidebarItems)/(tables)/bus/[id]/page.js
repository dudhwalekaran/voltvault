"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditBus() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [busDetails, setBusDetails] = useState({
    busName: "",
    location: "",
    voltagePower: "",
    nominalKV: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to fetch bus details");
          return;
        }

        const response = await fetch(`/api/bus/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for GET request
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch bus details");
        }

        const data = await response.json();
        setBusDetails({
          busName: data.busName || "",
          location: data.location || "",
          voltagePower: data.voltagePower || "",
          nominalKV: data.nominalKV || "",
        });
      } catch (error) {
        console.error(error);
        setError(error.message || "Error fetching bus details.");
      }
    };
    fetchBus();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please log in to update bus");
      }

      const response = await fetch(`/api/bus/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for PATCH request
        },
        body: JSON.stringify(busDetails),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || result.message || "Failed to update bus");
      }

      router.push("/bus");
    } catch (error) {
      console.error("Error updating bus:", error);
      setError(error.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusDetails({ ...busDetails, [name]: value });
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Edit Bus</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="busName" className="text-base font-normal mb-2">
            Bus Name
          </label>
          <input
            type="text"
            id="busName"
            name="busName"
            placeholder="Enter Bus Name"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busDetails.busName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="text-base font-normal mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter Location"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busDetails.location}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="voltagePower" className="text-base font-normal mb-2">
            Voltage Power
          </label>
          <input
            type="text"
            id="voltagePower"
            name="voltagePower"
            placeholder="Enter Voltage Power"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busDetails.voltagePower}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="nominalKV" className="text-base font-normal mb-2">
            Nominal KV
          </label>
          <input
            type="text"
            id="nominalKV"
            name="nominalKV"
            placeholder="Enter Nominal KV"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busDetails.nominalKV}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-500 col-span-2">{error}</p>}

        <div className="flex space-x-4 col-span-2 mt-5">
          <button
            type="submit"
            className={`bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <Link href="/bus">
            <button
              type="button"
              className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}