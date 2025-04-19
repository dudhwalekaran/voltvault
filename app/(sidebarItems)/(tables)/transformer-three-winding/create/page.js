"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for redirection after success

export default function TransformerThreeWindingCreate() {
  // Renamed for clarity
  const [location, setLocation] = useState("");
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(false); // Boolean for checkbox
  const [busprimaryFrom, setBusprimaryFrom] = useState("");
  const [busprimarySectionFrom, setBusprimarySectionFrom] = useState("");
  const [bussecondaryTo, setBussecondaryTo] = useState("");
  const [busSectionSecondaryTo, setBusSectionSecondaryTo] = useState("");
  const [bustertiaryTo, setBustertiaryTo] = useState("");
  const [busSectionTertiaryTo, setBusSectionTertiaryTo] = useState("");
  const [mva, setMva] = useState("");
  const [kvprimaryVoltage, setKvprimaryVoltage] = useState("");
  const [kvsecondaryVoltage, setKvsecondaryVoltage] = useState("");
  const [kvtertiaryVoltage, setKvtertiaryVoltage] = useState("");
  const [psprimarysecondaryR, setPsprimarysecondaryR] = useState("");
  const [psprimarysecondaryX, setPsprimarysecondaryX] = useState("");
  const [ptprimarytertiaryR, setPtprimarytertiaryR] = useState("");
  const [ptprimarytertiaryX, setPtprimarytertiaryX] = useState("");
  const [stsecondarytertiaryR, setStsecondarytertiaryR] = useState("");
  const [stsecondarytertiaryX, setStsecondarytertiaryX] = useState("");
  const [tapPrimary, setTapPrimary] = useState(""); // Fixed camelCase
  const [tapSecondary, setTapSecondary] = useState(""); // Fixed camelCase
  const [tapTertiary, setTapTertiary] = useState(""); // Fixed camelCase
  const [primaryConnection, setPrimaryConnection] = useState("");
  const [primaryConnectionGrounding, setPrimaryConnectionGrounding] =
    useState("");
  const [secondaryConnection, setSecondaryConnection] = useState("");
  const [secondaryConnectionGrounding, setSecondaryConnectionGrounding] =
    useState("");
  const [tertiaryConnection, setTertiaryConnection] = useState("");
  const [tertiaryConnectionGrounding, setTertiaryConnectionGrounding] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Added for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    // Validate that at least the required fields are filled (adjust based on schema)
    if (!location || !mva || !kvprimaryVoltage) {
      setError("Location, MVA, and Primary Voltage are required.");
      setLoading(false);
      return;
    }

    try {
      const transformerData = {
        location,
        circuitBreakerStatus: circuitBreakerStatus ? "On" : "Off", // Convert boolean to string per schema
        busprimaryFrom,
        busprimarySectionFrom,
        bussecondaryTo,
        busSectionSecondaryTo,
        bustertiaryTo,
        busSectionTertiaryTo,
        mva,
        kvprimaryVoltage,
        kvsecondaryVoltage,
        kvtertiaryVoltage,
        psprimarysecondaryR,
        psprimarysecondaryX,
        ptprimarytertiaryR,
        ptprimarytertiaryX,
        stsecondarytertiaryR,
        stsecondarytertiaryX,
        TapPrimary: tapPrimary,
        TapSecondary: tapSecondary,
        TapTertiary: tapTertiary,
        primaryConnection,
        primaryConnectionGrounding,
        secondaryConnection,
        secondaryConnectionGrounding,
        tertiaryConnection,
        tertiaryConnectionGrounding,
      };

      console.log("Sending data to API:", transformerData);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("/api/transformer-three-winding", {
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
          data.error || "Failed to create Transformer Three Winding"
        );
      }

      alert(data.message); // Role-specific message from backend
      // Reset form fields
      setLocation("");
      setCircuitBreakerStatus(false);
      setBusprimaryFrom("");
      setBusprimarySectionFrom("");
      setBussecondaryTo("");
      setBusSectionSecondaryTo("");
      setBustertiaryTo("");
      setBusSectionTertiaryTo("");
      setMva("");
      setKvprimaryVoltage("");
      setKvsecondaryVoltage("");
      setKvtertiaryVoltage("");
      setPsprimarysecondaryR("");
      setPsprimarysecondaryX("");
      setPtprimarytertiaryR("");
      setPtprimarytertiaryX("");
      setStsecondarytertiaryR("");
      setStsecondarytertiaryX("");
      setTapPrimary("");
      setTapSecondary("");
      setTapTertiary("");
      setPrimaryConnection("");
      setPrimaryConnectionGrounding("");
      setSecondaryConnection("");
      setSecondaryConnectionGrounding("");
      setTertiaryConnection("");
      setTertiaryConnectionGrounding("");
      router.push("/transformer-three-winding"); // Redirect after success
    } catch (error) {
      console.error("Error during submission:", error.message);
      setError(error.message || "Failed to create Transformer Three Winding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Transformer Three Winding</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
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
            disabled={loading}
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
              disabled={loading}
            />
            <span className="ml-2">On/Off</span>
          </label>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="busprimaryFrom"
            className="text-base font-normal mb-2"
          >
            Bus Primary From
          </label>
          <input
            type="text"
            id="busprimaryFrom"
            placeholder="Enter Bus Primary From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busprimaryFrom}
            onChange={(e) => setBusprimaryFrom(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="busprimarySectionFrom"
            className="text-base font-normal mb-2"
          >
            Bus Primary Section From
          </label>
          <input
            type="text"
            id="busprimarySectionFrom"
            placeholder="Enter Bus Primary Section From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busprimarySectionFrom}
            onChange={(e) => setBusprimarySectionFrom(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="bussecondaryTo"
            className="text-base font-normal mb-2"
          >
            Bus Secondary To
          </label>
          <input
            type="text"
            id="bussecondaryTo"
            placeholder="Enter Bus Secondary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={bussecondaryTo}
            onChange={(e) => setBussecondaryTo(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="busSectionSecondaryTo"
            className="text-base font-normal mb-2"
          >
            Bus Section Secondary To
          </label>
          <input
            type="text"
            id="busSectionSecondaryTo"
            placeholder="Enter Bus Section Secondary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionSecondaryTo}
            onChange={(e) => setBusSectionSecondaryTo(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bustertiaryTo" className="text-base font-normal mb-2">
            Bus Tertiary To
          </label>
          <input
            type="text"
            id="bustertiaryTo"
            placeholder="Enter Bus Tertiary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={bustertiaryTo}
            onChange={(e) => setBustertiaryTo(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="busSectionTertiaryTo"
            className="text-base font-normal mb-2"
          >
            Bus Section Tertiary To
          </label>
          <input
            type="text"
            id="busSectionTertiaryTo"
            placeholder="Enter Bus Section Tertiary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionTertiaryTo}
            onChange={(e) => setBusSectionTertiaryTo(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mva" className="text-base font-normal mb-2">
            MVA
          </label>
          <input
            type="text"
            id="mva"
            placeholder="Enter MVA"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={mva}
            onChange={(e) => setMva(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="kvprimaryVoltage"
            className="text-base font-normal mb-2"
          >
            KV Primary Voltage
          </label>
          <input
            type="text"
            id="kvprimaryVoltage"
            placeholder="Enter KV Primary Voltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvprimaryVoltage}
            onChange={(e) => setKvprimaryVoltage(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="kvsecondaryVoltage"
            className="text-base font-normal mb-2"
          >
            KV Secondary Voltage
          </label>
          <input
            type="text"
            id="kvsecondaryVoltage"
            placeholder="Enter KV Secondary Voltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvsecondaryVoltage}
            onChange={(e) => setKvsecondaryVoltage(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="kvtertiaryVoltage"
            className="text-base font-normal mb-2"
          >
            KV Tertiary Voltage
          </label>
          <input
            type="text"
            id="kvtertiaryVoltage"
            placeholder="Enter KV Tertiary Voltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvtertiaryVoltage}
            onChange={(e) => setKvtertiaryVoltage(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="psprimarysecondaryR"
            className="text-base font-normal mb-2"
          >
            PS Primary-Secondary R
          </label>
          <input
            type="text"
            id="psprimarysecondaryR"
            placeholder="Enter PS Primary-Secondary R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={psprimarysecondaryR}
            onChange={(e) => setPsprimarysecondaryR(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="psprimarysecondaryX"
            className="text-base font-normal mb-2"
          >
            PS Primary-Secondary X
          </label>
          <input
            type="text"
            id="psprimarysecondaryX"
            placeholder="Enter PS Primary-Secondary X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={psprimarysecondaryX}
            onChange={(e) => setPsprimarysecondaryX(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="ptprimarytertiaryR"
            className="text-base font-normal mb-2"
          >
            PT Primary-Tertiary R
          </label>
          <input
            type="text"
            id="ptprimarytertiaryR"
            placeholder="Enter PT Primary-Tertiary R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={ptprimarytertiaryR}
            onChange={(e) => setPtprimarytertiaryR(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="ptprimarytertiaryX"
            className="text-base font-normal mb-2"
          >
            PT Primary-Tertiary X
          </label>
          <input
            type="text"
            id="ptprimarytertiaryX"
            placeholder="Enter PT Primary-Tertiary X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={ptprimarytertiaryX}
            onChange={(e) => setPtprimarytertiaryX(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="stsecondarytertiaryR"
            className="text-base font-normal mb-2"
          >
            ST Secondary-Tertiary R
          </label>
          <input
            type="text"
            id="stsecondarytertiaryR"
            placeholder="Enter ST Secondary-Tertiary R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={stsecondarytertiaryR}
            onChange={(e) => setStsecondarytertiaryR(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="stsecondarytertiaryX"
            className="text-base font-normal mb-2"
          >
            ST Secondary-Tertiary X
          </label>
          <input
            type="text"
            id="stsecondarytertiaryX"
            placeholder="Enter ST Secondary-Tertiary X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={stsecondarytertiaryX}
            onChange={(e) => setStsecondarytertiaryX(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tapPrimary" className="text-base font-normal mb-2">
            Tap Primary
          </label>
          <input
            type="text"
            id="tapPrimary"
            placeholder="Enter Tap Primary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tapPrimary}
            onChange={(e) => setTapPrimary(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tapSecondary" className="text-base font-normal mb-2">
            Tap Secondary
          </label>
          <input
            type="text"
            id="tapSecondary"
            placeholder="Enter Tap Secondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tapSecondary}
            onChange={(e) => setTapSecondary(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tapTertiary" className="text-base font-normal mb-2">
            Tap Tertiary
          </label>
          <input
            type="text"
            id="tapTertiary"
            placeholder="Enter Tap Tertiary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tapTertiary}
            onChange={(e) => setTapTertiary(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="primaryConnection"
            className="text-base font-normal mb-2"
          >
            Primary Connection
          </label>
          <input
            type="text"
            id="primaryConnection"
            placeholder="Enter Primary Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryConnection}
            onChange={(e) => setPrimaryConnection(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="primaryConnectionGrounding"
            className="text-base font-normal mb-2"
          >
            Primary Connection Grounding
          </label>
          <input
            type="text"
            id="primaryConnectionGrounding"
            placeholder="Enter Primary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryConnectionGrounding}
            onChange={(e) => setPrimaryConnectionGrounding(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="secondaryConnection"
            className="text-base font-normal mb-2"
          >
            Secondary Connection
          </label>
          <input
            type="text"
            id="secondaryConnection"
            placeholder="Enter Secondary Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryConnection}
            onChange={(e) => setSecondaryConnection(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="secondaryConnectionGrounding"
            className="text-base font-normal mb-2"
          >
            Secondary Connection Grounding
          </label>
          <input
            type="text"
            id="secondaryConnectionGrounding"
            placeholder="Enter Secondary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryConnectionGrounding}
            onChange={(e) => setSecondaryConnectionGrounding(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="tertiaryConnection"
            className="text-base font-normal mb-2"
          >
            Tertiary Connection
          </label>
          <input
            type="text"
            id="tertiaryConnection"
            placeholder="Enter Tertiary Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tertiaryConnection}
            onChange={(e) => setTertiaryConnection(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="tertiaryConnectionGrounding"
            className="text-base font-normal mb-2"
          >
            Tertiary Connection Grounding
          </label>
          <input
            type="text"
            id="tertiaryConnectionGrounding"
            placeholder="Enter Tertiary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tertiaryConnectionGrounding}
            onChange={(e) => setTertiaryConnectionGrounding(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex space-x-4 mt-5 col-span-2">
          {" "}
          {/* Adjusted to span both columns */}
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <Link href="/transformer-three-winding">
            <button
              type="button"
              className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-red-600" // Fixed hover color
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
