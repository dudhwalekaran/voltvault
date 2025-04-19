"use client";

import { useState } from "react";
import Link from "next/link";

export default function GeneratorCreate() {
  const [location, setLocation] = useState("");
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(false); // For the switch
  const [busTo, setBusTo] = useState("");
  const [busSectionTo, setBusSectionTo] = useState("");
  const [type, setType] = useState("");
  const [rotor, setRotor] = useState("");
  const [mw, setMw] = useState("");
  const [mva, setMva] = useState("");
  const [kv, setKv] = useState("");
  const [synchronousReactancePuXd, setSynchronousReactancePuXd] = useState("");
  const [synchronousReactancePuXq, setSynchronousReactancePuXq] = useState("");
  const [transientReactancePuXdPrime, setTransientReactancePuXdPrime] =
    useState("");
  const [transientReactancePuXqPrime, setTransientReactancePuXqPrime] =
    useState("");
  const [
    subtransientReactancePuXdPrimePrime,
    setSubtransientReactancePuXdPrimePrime,
  ] = useState("");
  const [
    subtransientReactancePuXqPrimePrime,
    setSubtransientReactancePuXqPrimePrime,
  ] = useState("");
  const [
    transientOCTimeConstantSecondsTd0Prime,
    setTransientOCTimeConstantSecondsTd0Prime,
  ] = useState("");
  const [
    transientOCTimeConstantSecondsTq0Prime,
    setTransientOCTimeConstantSecondsTq0Prime,
  ] = useState("");
  const [
    subtransientOCTimeConstantSecondsTd0PrimePrime,
    setSubtransientOCTimeConstantSecondsTd0PrimePrime,
  ] = useState("");
  const [
    subtransientOCTimeConstantSecondsTq0PrimePrime,
    setSubtransientOCTimeConstantSecondsTq0PrimePrime,
  ] = useState("");
  const [statorLeakageInductancePuXl, setStatorLeakageInductancePuXl] =
    useState("");
  const [statorResistancePuRa, setStatorResistancePuRa] = useState("");
  const [inertiaMJMVAH, setInertiaMJMVAH] = useState("");

  const [poles, setPoles] = useState("");
  const [speed, setSpeed] = useState("");
  const [frequency, setFrequency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const generatorData = {
        location,
        circuitBreakerStatus,
        busTo,
        busSectionTo,
        type,
        rotor,
        mw,
        mva,
        kv,
        synchronousReactancePuXd,
        synchronousReactancePuXq,
        transientReactancePuXdPrime,
        transientReactancePuXqPrime,
        subtransientReactancePuXdPrimePrime,
        subtransientReactancePuXqPrimePrime,
        transientOCTimeConstantSecondsTd0Prime,
        transientOCTimeConstantSecondsTq0Prime,
        subtransientOCTimeConstantSecondsTd0PrimePrime,
        subtransientOCTimeConstantSecondsTq0PrimePrime,
        statorLeakageInductancePuXl,
        statorResistancePuRa,
        inertiaMJMVAH,
        poles,
        speed,
        frequency,
      };
  
      console.log("Sending data to API:", generatorData);
  
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      const response = await fetch("/api/generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(generatorData),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (response.ok) {
        alert(data.message); // Role-specific message from backend
        setLocation("");
        setCircuitBreakerStatus(false);
        setBusTo("");
        setBusSectionTo("");
        setType("");
        setRotor("");
        setMw("");
        setMva("");
        setKv("");
        setSynchronousReactancePuXd("");
        setSynchronousReactancePuXq("");
        setTransientReactancePuXdPrime("");
        setTransientReactancePuXqPrime("");
        setSubtransientReactancePuXdPrimePrime("");
        setSubtransientReactancePuXqPrimePrime("");
        setTransientOCTimeConstantSecondsTd0Prime("");
        setTransientOCTimeConstantSecondsTq0Prime("");
        setSubtransientOCTimeConstantSecondsTd0PrimePrime("");
        setSubtransientOCTimeConstantSecondsTq0PrimePrime("");
        setStatorLeakageInductancePuXl("");
        setStatorResistancePuRa("");
        setInertiaMJMVAH("");
        setPoles("");
        setSpeed("");
        setFrequency("");
      } else {
        setError(data.error || "Failed to create Generator");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError(error.message || "Failed to create Generator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Generator</h1>
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
            Bus (To)
          </label>
          <input
            type="text"
            id="busTo"
            placeholder="Other"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busTo}
            onChange={(e) => setBusTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionTo" className="text-base font-normal mb-2">
            Bus Section (To)
          </label>
          <input
            type="text"
            id="busSectionTo"
            placeholder="Bus Section (To)"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionTo}
            onChange={(e) => setBusSectionTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="text-base font-normal mb-2">
            Type
          </label>
          <input
            type="text"
            id="type"
            placeholder="Enter a Value Gas, Hydro or Steam"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rotor" className="text-base font-normal mb-2">
            Rotor
          </label>
          <input
            type="text"
            id="rotor"
            placeholder="Enter a Value Round rotor or Salient rotor"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={rotor}
            onChange={(e) => setRotor(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mw" className="text-base font-normal mb-2">
            MW
          </label>
          <input
            type="text"
            id="mw"
            placeholder="MW"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={mw}
            onChange={(e) => setMw(e.target.value)}
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
            Kv
          </label>
          <input
            type="text"
            id="kv"
            placeholder="Kv"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kv}
            onChange={(e) => setKv(e.target.value)}
          />
        </div>

        {/* Add more fields for other data */}
        <div className="flex flex-col">
          <label
            htmlFor="synchronousReactanceXd"
            className="text-base font-normal mb-2"
          >
            Synchronous Reactance (pu): Xd
          </label>
          <input
            type="text"
            id="synchronousReactanceXd"
            placeholder="Synchronous Reactance (pu): Xd"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={synchronousReactancePuXd}
            onChange={(e) => setSynchronousReactancePuXd(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="synchronousReactanceXq"
            className="text-base font-normal mb-2"
          >
            Synchronous Reactance (pu): Xq
          </label>
          <input
            type="text"
            id="synchronousReactanceXq"
            placeholder="Synchronous Reactance (pu): Xq"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={synchronousReactancePuXq}
            onChange={(e) => setSynchronousReactancePuXq(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientReactanceXd"
            className="text-base font-normal mb-2"
          >
            Transient Reactance (pu): Xd
          </label>
          <input
            type="text"
            id="transientReactanceXd"
            placeholder="Transient Reactance (pu): Xd"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={transientOCTimeConstantSecondsTd0Prime}
            onChange={(e) => setTransientOCTimeConstantSecondsTd0Prime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientReactanceXq"
            className="text-base font-normal mb-2"
          >
            Transient Reactance (pu): Xq
          </label>
          <input
            type="text"
            id="transientReactanceXq"
            placeholder="Transient Reactance (pu): Xq"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={transientReactancePuXqPrime}
            onChange={(e) => setTransientReactancePuXqPrime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientReactanceXd"
            className="text-base font-normal mb-2"
          >
            Subtransient Reactance (pu): Xd
          </label>
          <input
            type="text"
            id="subtransientReactanceXd"
            placeholder="Subtransient Reactance (pu): Xd"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={subtransientReactancePuXdPrimePrime}
            onChange={(e) => setSubtransientReactancePuXdPrimePrime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientReactanceXq"
            className="text-base font-normal mb-2"
          >
            Subtransient Reactance (pu): Xq
          </label>
          <input
            type="text"
            id="subtransientReactanceXq"
            placeholder="Subtransient Reactance (pu): Xq"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={subtransientReactancePuXqPrimePrime}
            onChange={(e) => setSubtransientReactancePuXqPrimePrime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientOCTimeConstantTd0"
            className="text-base font-normal mb-2"
          >
            Transient OC Time Constant (seconds): Td0
          </label>
          <input
            type="text"
            id="transientOCTimeConstantTd0"
            placeholder="Transient OC Time Constant (seconds): Td0"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={transientReactancePuXdPrime}
            onChange={(e) => setTransientReactancePuXdPrime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            Transient OC Time Constant (seconds): Tq0
          </label>
          <input
            type="text"
            id="transientOCTimeConstantTq0"
            placeholder="Transient OC Time Constant (seconds): Tq0"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={transientOCTimeConstantSecondsTq0Prime}
            onChange={(e) => setTransientOCTimeConstantSecondsTq0Prime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTd0"
            className="text-base font-normal mb-2"
          >
            Subtransient OC Time Constant (seconds): Td0
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTd0"
            placeholder="Subtransient OC Time Constant (seconds): Td0"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={subtransientOCTimeConstantSecondsTd0PrimePrime}
            onChange={(e) => setSubtransientOCTimeConstantSecondsTd0PrimePrime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            Subtransient OC Time Constant (seconds): Tq0
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTq0"
            placeholder="Subtransient OC Time Constant (seconds): Tq0"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={subtransientOCTimeConstantSecondsTq0PrimePrime}
            onChange={(e) => setSubtransientOCTimeConstantSecondsTq0PrimePrime(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="statorLeakageInductanceXl"
            className="text-base font-normal mb-2"
          >
            Stator Leakage Inductance (pu): Xl
          </label>
          <input
            type="text"
            id="statorLeakageInductanceXl"
            placeholder="Stator Leakage Inductance (pu): Xl"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={statorLeakageInductancePuXl}
            onChange={(e) => setStatorLeakageInductancePuXl(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="statorResistanceRa"
            className="text-base font-normal mb-2"
          >
            Stator resistance (pu): Ra
          </label>
          <input
            type="text"
            id="statorResistanceRa"
            placeholder="Stator resistance (pu): Ra"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={statorResistancePuRa}
            onChange={(e) => setStatorResistancePuRa(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="inertiaMJPerMVAH"
            className="text-base font-normal mb-2"
          >
            Inertia (MJ/MVA): H
          </label>
          <input
            type="text"
            id="inertiaMJPerMVAH"
            placeholder="Inertia (MJ/MVA): H"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={inertiaMJMVAH}
            onChange={(e) => setInertiaMJMVAH(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="poles" className="text-base font-normal mb-2">
            Poles
          </label>
          <input
            type="text"
            id="poles"
            placeholder="Poles"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={poles}
            onChange={(e) => setPoles(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="speed" className="text-base font-normal mb-2">
            Speed
          </label>
          <input
            type="text"
            id="speed"
            placeholder="Speed"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="frequency" className="text-base font-normal mb-2">
            Frequency
          </label>
          <input
            type="text"
            id="frequency"
            placeholder="Frequency"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
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
          <Link href="/generator">
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
