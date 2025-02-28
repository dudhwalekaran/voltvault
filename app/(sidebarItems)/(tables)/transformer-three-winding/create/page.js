"use client";

import { useState } from "react";
import Link from "next/link";

export default function GeneratorCreate() {
  const [location, setLocation] = useState("");
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(false);
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
  const [TapPrimary, setTapPrimary] = useState("");
  const [TapSecondary, setTapSecondary] = useState("");
  const [TapTertiary, setTapTertiary] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatorData = {
        location,
        circuitBreakerStatus,
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
        TapPrimary,
        TapSecondary,
        TapTertiary,
        primaryConnection,
        primaryConnectionGrounding,
        secondaryConnection,
        secondaryConnectionGrounding,
        tertiaryConnection,
        tertiaryConnectionGrounding,
      };

      console.log("Sending data to API:", generatorData);

      const response = await fetch("/api/transformer-three-winding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatorData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert("Winding created successfully!");
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
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Failed to create winding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Transformer Three winding</h1>
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
          <label htmlFor="busprimaryFrom" className="text-base font-normal mb-2">
          busprimaryFrom
          </label>
          <input
            type="text"
            id="busprimaryFrom"
            placeholder="Other"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busprimaryFrom}
            onChange={(e) => setBusprimaryFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busprimarySectionFrom" className="text-base font-normal mb-2">
          busprimarySectionFrom
          </label>
          <input
            type="text"
            id="busprimarySectionFrom"
            placeholder="Bus Section (To)"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busprimarySectionFrom}
            onChange={(e) => setBusprimarySectionFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bussecondaryTo" className="text-base font-normal mb-2">
            Type
          </label>
          <input
            type="text"
            id="bussecondaryTo"
            placeholder="Enter a Value Gas, Hydro or Steam"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={bussecondaryTo}
            onChange={(e) => setBussecondaryTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionSecondaryTo" className="text-base font-normal mb-2">
            busSectionSecondaryTo
          </label>
          <input
            type="text"
            id="busSectionSecondaryTo"
            placeholder="Enter a Value Round rotor or Salient rotor"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionSecondaryTo}
            onChange={(e) => setBusSectionSecondaryTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bustertiaryTo" className="text-base font-normal mb-2">
            bustertiaryTo
          </label>
          <input
            type="text"
            id="bustertiaryTo"
            placeholder="bustertiaryTo"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={bustertiaryTo}
            onChange={(e) => setBustertiaryTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionTertiaryTo" className="text-base font-normal mb-2">
            busSectionTertiaryTo
          </label>
          <input
            type="text"
            id="busSectionTertiaryTo"
            placeholder="busSectionTertiaryTo"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionTertiaryTo}
            onChange={(e) => setBusSectionTertiaryTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mva" className="text-base font-normal mb-2">
            mva
          </label>
          <input
            type="text"
            id="mva"
            placeholder="mva"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={mva}
            onChange={(e) => setMva(e.target.value)}
          />
        </div>

        {/* Add more fields for other data */}
        <div className="flex flex-col">
          <label
            htmlFor="kvprimaryVoltage"
            className="text-base font-normal mb-2"
          >
            kvprimaryVoltage
          </label>
          <input
            type="text"
            id="kvprimaryVoltage"
            placeholder="kvprimaryVoltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvprimaryVoltage}
            onChange={(e) => setKvprimaryVoltage(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="kvsecondaryVoltage"
            className="text-base font-normal mb-2"
          >
            kvsecondaryVoltage
          </label>
          <input
            type="text"
            id="kvsecondaryVoltage"
            placeholder="kvsecondaryVoltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvsecondaryVoltage}
            onChange={(e) => setKvsecondaryVoltage(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="kvtertiaryVoltage"
            className="text-base font-normal mb-2"
          >
            Transient Reactance (pu): Xd
          </label>
          <input
            type="text"
            id="kvtertiaryVoltage"
            placeholder="kvtertiaryVoltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kvtertiaryVoltage}
            onChange={(e) =>
              setKvtertiaryVoltage(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="psprimarysecondaryR"
            className="text-base font-normal mb-2"
          >
            psprimarysecondaryR
          </label>
          <input
            type="text"
            id="psprimarysecondaryR"
            placeholder="psprimarysecondaryR"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={psprimarysecondaryR}
            onChange={(e) => setPsprimarysecondaryR(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="psprimarysecondaryX"
            className="text-base font-normal mb-2"
          >
           psprimarysecondaryX
          </label>
          <input
            type="text"
            id="psprimarysecondaryX"
            placeholder="psprimarysecondaryX"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={psprimarysecondaryX}
            onChange={(e) =>
              setPsprimarysecondaryX(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="ptprimarytertiaryR"
            className="text-base font-normal mb-2"
          >
            ptprimarytertiaryR
          </label>
          <input
            type="text"
            id="ptprimarytertiaryR"
            placeholder="ptprimarytertiaryR"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={ptprimarytertiaryR}
            onChange={(e) =>
              setPtprimarytertiaryR(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="ptprimarytertiaryX"
            className="text-base font-normal mb-2"
          >
            ptprimarytertiaryX
          </label>
          <input
            type="text"
            id="ptprimarytertiaryX"
            placeholder="Transient OC Time Constant (seconds): Td0"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={ptprimarytertiaryX}
            onChange={(e) => setPtprimarytertiaryX(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="stsecondarytertiaryR"
            className="text-base font-normal mb-2"
          >
            stsecondarytertiaryR
          </label>
          <input
            type="text"
            id="stsecondarytertiaryR"
            placeholder="stsecondarytertiaryR"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={stsecondarytertiaryR}
            onChange={(e) =>
              setStsecondarytertiaryR(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="stsecondarytertiaryX"
            className="text-base font-normal mb-2"
          >
            stsecondarytertiaryX
          </label>
          <input
            type="text"
            id="stsecondarytertiaryX"
            placeholder="stsecondarytertiaryX"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={stsecondarytertiaryX}
            onChange={(e) =>
              setStsecondarytertiaryX(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="TapPrimary"
            className="text-base font-normal mb-2"
          >
            TapPrimary
          </label>
          <input
            type="text"
            id="TapPrimary"
            placeholder="TapPrimary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapPrimary}
            onChange={(e) =>
              setTapPrimary(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="TapSecondary"
            className="text-base font-normal mb-2"
          >
            TapSecondary
          </label>
          <input
            type="text"
            id="TapSecondary"
            placeholder="TapSecondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapSecondary}
            onChange={(e) => setTapSecondary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="TapTertiary"
            className="text-base font-normal mb-2"
          >
            TapTertiary
          </label>
          <input
            type="text"
            id="TapTertiary"
            placeholder="TapTertiary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={TapTertiary}
            onChange={(e) => setTapTertiary(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="primaryConnection"
            className="text-base font-normal mb-2"
          >
            primaryConnection
          </label>
          <input
            type="text"
            id="primaryConnection"
            placeholder="primaryConnection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryConnection}
            onChange={(e) => setPrimaryConnection(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="primaryConnectionGrounding" className="text-base font-normal mb-2">
            primaryConnectionGrounding
          </label>
          <input
            type="text"
            id="primaryConnectionGrounding"
            placeholder="primaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={primaryConnectionGrounding}
            onChange={(e) => setPrimaryConnectionGrounding(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryConnection" className="text-base font-normal mb-2">
            secondaryConnection
          </label>
          <input
            type="text"
            id="secondaryConnection"
            placeholder="secondaryConnection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryConnection}
            onChange={(e) => setSecondaryConnection(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryConnectionGrounding" className="text-base font-normal mb-2">
            secondaryConnectionGrounding
          </label>
          <input
            type="text"
            id="secondaryConnectionGrounding"
            placeholder="secondaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={secondaryConnectionGrounding}
            onChange={(e) => setSecondaryConnectionGrounding(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tertiaryConnection" className="text-base font-normal mb-2">
            tertiaryConnection
          </label>
          <input
            type="text"
            id="tertiaryConnection"
            placeholder="tertiaryConnection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tertiaryConnection}
            onChange={(e) => setTertiaryConnection(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tertiaryConnectionGrounding" className="text-base font-normal mb-2">
            tertiaryConnectionGrounding
          </label>
          <input
            type="text"
            id="tertiaryConnectionGrounding"
            placeholder="tertiaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={tertiaryConnectionGrounding}
            onChange={(e) => setTertiaryConnectionGrounding(e.target.value)}
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
          <Link href="/transformer-three-winding">
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
