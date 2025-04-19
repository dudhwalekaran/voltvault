"use client";

import { useState } from "react";
import Link from "next/link";

export default function GeneratorCreate() {
  const [location, setLocation] = useState("");
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(false); // For the switch
  const [busFrom, setBusFrom] = useState("");
  const [busSectionFrom, setBusSectionFrom] = useState("");
  const [busTo, setBusTo] = useState("");
  const [busSectionTo, setBusSectionTo] = useState("");
  const [mva, setMva] = useState("");
  const [kvprimary, setKvprimary] = useState("");
  const [kvsecondary, setKvsecondary] = useState("");
  const [r, setR] = useState("");
  const [x, setX] = useState("");
  const [TapPrimary, setTapPrimary] = useState("");
  const [TapSecondary, setTapSecondary] = useState("");
  const [primaryWindingConnection, setPrimaryWindingConnection] = useState("");
  const [primaryConnectionGrounding, setPrimaryConnectionGrounding] =
    useState("");
  const [secondaryWindingConnection, setSecondaryWindingConnection] =
    useState("");
  const [secondaryConnectionGrounding, setSecondaryConnectionGrounding] =
    useState("");
  const [angle, setAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
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

      console.log("Sending data to API:", transformerData);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("/api/transformer-two-winding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformerData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create Transformer Two Winding"
        );
      }

      alert(data.message); // Role-specific message from backend
      // Reset form fields
      setLocation("");
      setCircuitBreakerStatus(false);
      setBusFrom("");
      setBusSectionFrom("");
      setBusTo("");
      setBusSectionTo("");
      setMva("");
      setKvprimary("");
      setKvsecondary("");
      setR("");
      setX("");
      setTapPrimary("");
      setTapSecondary("");
      setPrimaryWindingConnection("");
      setPrimaryConnectionGrounding("");
      setSecondaryWindingConnection("");
      setSecondaryConnectionGrounding("");
      setAngle("");
      window.location.href = "/transformer-two-winding"; // Redirect after success
    } catch (error) {
      console.error("Error during submission:", error.message);
      setError(error.message || "Failed to create Transformer Two Winding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Two Winding</h1>
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
          <label
            htmlFor="circuitBreakerStatus"
            className="text-base font-normal mb-2"
          >
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
          <label htmlFor="busTo" className="text-base font-normal mb-2">
            busFrom
          </label>
          <input
            type="text"
            id="busTo"
            placeholder="Bus From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busFrom}
            onChange={(e) => setBusFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionTo" className="text-base font-normal mb-2">
            busSectionFrom
          </label>
          <input
            type="text"
            id="busSectionTo"
            placeholder="busSectionFrom"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionFrom}
            onChange={(e) => setBusSectionFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="text-base font-normal mb-2">
            busTo
          </label>
          <input
            type="text"
            id="type"
            placeholder="busTo"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busTo}
            onChange={(e) => setBusTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rotor" className="text-base font-normal mb-2">
            busSectionTo
          </label>
          <input
            type="text"
            id="rotor"
            placeholder="busSectionTo"
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
          <label htmlFor="kv" className="text-base font-normal mb-2">
            kvprimary
          </label>
          <input
            type="text"
            id="kv"
            placeholder="kvprimary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvprimary}
            onChange={(e) => setKvprimary(e.target.value)}
          />
        </div>

        {/* Add more fields for other data */}
        <div className="flex flex-col">
          <label
            htmlFor="synchronousReactanceXd"
            className="text-base font-normal mb-2"
          >
            kvsecondary
          </label>
          <input
            type="text"
            id="synchronousReactanceXd"
            placeholder="kvsecondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvsecondary}
            onChange={(e) => setKvsecondary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="synchronousReactanceXq"
            className="text-base font-normal mb-2"
          >
            r
          </label>
          <input
            type="text"
            id="synchronousReactanceXq"
            placeholder="r"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={r}
            onChange={(e) => setR(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientReactanceXd"
            className="text-base font-normal mb-2"
          >
            x
          </label>
          <input
            type="text"
            id="transientReactanceXd"
            placeholder="x"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientReactanceXq"
            className="text-base font-normal mb-2"
          >
            TapPrimary
          </label>
          <input
            type="text"
            id="transientReactanceXq"
            placeholder="TapPrimary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapPrimary}
            onChange={(e) => setTapPrimary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientReactanceXd"
            className="text-base font-normal mb-2"
          >
            TapSecondary
          </label>
          <input
            type="text"
            id="subtransientReactanceXd"
            placeholder="TapSecondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapSecondary}
            onChange={(e) => setTapSecondary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientReactanceXq"
            className="text-base font-normal mb-2"
          >
            primaryWindingConnection
          </label>
          <input
            type="text"
            id="subtransientReactanceXq"
            placeholder="primaryWindingConnection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryWindingConnection}
            onChange={(e) => setPrimaryWindingConnection(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientOCTimeConstantTd0"
            className="text-base font-normal mb-2"
          >
            primaryConnectionGrounding
          </label>
          <input
            type="text"
            id="transientOCTimeConstantTd0"
            placeholder="primaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryConnectionGrounding}
            onChange={(e) => setPrimaryConnectionGrounding(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            secondaryWindingConnection
          </label>
          <input
            type="text"
            id="transientOCTimeConstantTq0"
            placeholder="secondaryWindingConnection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryWindingConnection}
            onChange={(e) => setSecondaryWindingConnection(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTd0"
            className="text-base font-normal mb-2"
          >
            secondaryConnectionGrounding
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTd0"
            placeholder="secondaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryConnectionGrounding}
            onChange={(e) => setSecondaryConnectionGrounding(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            angle
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTq0"
            placeholder="angle"
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
            {loading ? "Submitting..." : "Submit"}
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
