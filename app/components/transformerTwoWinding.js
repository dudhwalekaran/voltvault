"use client";

import { useState } from "react";
import Link from "next/link";

export default function TransformerTwoWinding({ transformer, onSubmit }) {
  const [location, setLocation] = useState(transformer?.location || "");
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(
    transformer?.circuitBreakerStatus === "On"
  );
  const [busFrom, setBusFrom] = useState(transformer?.busFrom || "");
  const [busSectionFrom, setBusSectionFrom] = useState(transformer?.busSectionFrom || "");
  const [busTo, setBusTo] = useState(transformer?.busTo || "");
  const [busSectionTo, setBusSectionTo] = useState(transformer?.busSectionTo || "");
  const [mva, setMva] = useState(transformer?.mva || "");
  const [kvprimary, setKvprimary] = useState(transformer?.kvprimary || "");
  const [kvsecondary, setKvsecondary] = useState(transformer?.kvsecondary || "");
  const [r, setR] = useState(transformer?.r || "");
  const [x, setX] = useState(transformer?.x || "");
  const [TapPrimary, setTapPrimary] = useState(transformer?.TapPrimary || "");
  const [TapSecondary, setTapSecondary] = useState(transformer?.TapSecondary || "");
  const [primaryWindingConnection, setPrimaryWindingConnection] = useState(
    transformer?.primaryWindingConnection || ""
  );
  const [primaryConnectionGrounding, setPrimaryConnectionGrounding] = useState(
    transformer?.primaryConnectionGrounding || ""
  );
  const [secondaryWindingConnection, setSecondaryWindingConnection] = useState(
    transformer?.secondaryWindingConnection || ""
  );
  const [secondaryConnectionGrounding, setSecondaryConnectionGrounding] = useState(
    transformer?.secondaryConnectionGrounding || ""
  );
  const [angle, setAngle] = useState(transformer?.angle || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!location || !mva || !kvprimary) {
      setError("Location, MVA, and Primary Voltage are required.");
      setLoading(false);
      return;
    }

    try {
      const transformerData = {
        location,
        circuitBreakerStatus: circuitBreakerStatus ? "On" : "Off",
        busFrom,
        busSectionFrom,
        busTo,
        busSectionTo,
        mva,
        kvprimary,
        kvsecondary,
        r,
        x,
        TapPrimary,
        TapSecondary,
        primaryWindingConnection,
        primaryConnectionGrounding,
        secondaryWindingConnection,
        secondaryConnectionGrounding,
        angle,
      };

      console.log("Sending updated data to API:", transformerData);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(`/api/transformer-two-winding/${transformer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformerData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update Transformer Two Winding");
      }

      alert(data.message || "Transformer updated successfully");
      onSubmit(); // Callback to redirect or refresh parent page
    } catch (error) {
      console.error("Error during submission:", error.message);
      setError(error.message || "Failed to update Transformer Two Winding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Edit Two Winding</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="location" className="text-base font-normal mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="Enter Location"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="circuitBreakerStatus" className="text-base font-normal mb-2">
            Circuit Breaker Status
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              id="circuitBreakerStatus"
              checked={circuitBreakerStatus}
              onChange={() => setCircuitBreakerStatus(!circuitBreakerStatus)}
              className="form-checkbox"
            />
            <span className="ml-2">On/Off</span>
          </label>
        </div>

        <div className="flex flex-col">
          <label htmlFor="busFrom" className="text-base font-normal mb-2">
            Bus From
          </label>
          <input
            type="text"
            id="busFrom"
            placeholder="Bus From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busFrom}
            onChange={(e) => setBusFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionFrom" className="text-base font-normal mb-2">
            Bus Section From
          </label>
          <input
            type="text"
            id="busSectionFrom"
            placeholder="Bus Section From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionFrom}
            onChange={(e) => setBusSectionFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busTo" className="text-base font-normal mb-2">
            Bus To
          </label>
          <input
            type="text"
            id="busTo"
            placeholder="Bus To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busTo}
            onChange={(e) => setBusTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionTo" className="text-base font-normal mb-2">
            Bus Section To
          </label>
          <input
            type="text"
            id="busSectionTo"
            placeholder="Bus Section To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionTo}
            onChange={(e) => setBusSectionTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mva" className="text-base font-normal mb-2">
            MVA
          </label>
          <input
            type="text"
            id="mva"
            placeholder="MVA"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={mva}
            onChange={(e) => setMva(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kvprimary" className="text-base font-normal mb-2">
            KV Primary
          </label>
          <input
            type="text"
            id="kvprimary"
            placeholder="KV Primary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvprimary}
            onChange={(e) => setKvprimary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kvsecondary" className="text-base font-normal mb-2">
            KV Secondary
          </label>
          <input
            type="text"
            id="kvsecondary"
            placeholder="KV Secondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvsecondary}
            onChange={(e) => setKvsecondary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="r" className="text-base font-normal mb-2">
            R
          </label>
          <input
            type="text"
            id="r"
            placeholder="R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={r}
            onChange={(e) => setR(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="x" className="text-base font-normal mb-2">
            X
          </label>
          <input
            type="text"
            id="x"
            placeholder="X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="TapPrimary" className="text-base font-normal mb-2">
            Tap Primary
          </label>
          <input
            type="text"
            id="TapPrimary"
            placeholder="Tap Primary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapPrimary}
            onChange={(e) => setTapPrimary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="TapSecondary" className="text-base font-normal mb-2">
            Tap Secondary
          </label>
          <input
            type="text"
            id="TapSecondary"
            placeholder="Tap Secondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapSecondary}
            onChange={(e) => setTapSecondary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="primaryWindingConnection" className="text-base font-normal mb-2">
            Primary Winding Connection
          </label>
          <input
            type="text"
            id="primaryWindingConnection"
            placeholder="Primary Winding Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryWindingConnection}
            onChange={(e) => setPrimaryWindingConnection(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="primaryConnectionGrounding" className="text-base font-normal mb-2">
            Primary Connection Grounding
          </label>
          <input
            type="text"
            id="primaryConnectionGrounding"
            placeholder="Primary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryConnectionGrounding}
            onChange={(e) => setPrimaryConnectionGrounding(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryWindingConnection" className="text-base font-normal mb-2">
            Secondary Winding Connection
          </label>
          <input
            type="text"
            id="secondaryWindingConnection"
            placeholder="Secondary Winding Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryWindingConnection}
            onChange={(e) => setSecondaryWindingConnection(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryConnectionGrounding" className="text-base font-normal mb-2">
            Secondary Connection Grounding
          </label>
          <input
            type="text"
            id="secondaryConnectionGrounding"
            placeholder="Secondary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryConnectionGrounding}
            onChange={(e) => setSecondaryConnectionGrounding(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="angle" className="text-base font-normal mb-2">
            Angle
          </label>
          <input
            type="text"
            id="angle"
            placeholder="Angle"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
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
          <Link href="/transformer-two-winding">
            <button
              type="button"
              className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}