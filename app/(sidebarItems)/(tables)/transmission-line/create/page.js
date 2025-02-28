"use client";

import { useState } from "react";
import Link from "next/link";

export default function GeneratorCreate() {
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [type, setType] = useState("");
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(false);
  const [busFrom, setBusFrom] = useState("");
  const [busSectionFrom, setBusSectionFrom] = useState("");
  const [busTo, setBusTo] = useState("");
  const [busSectionTo, setBusSectionTo] = useState("");
  const [kv, setKv] = useState("");
  const [positiveSequenceRohmsperunitlength, setPositiveSequenceRohmsperunitlength] = useState("");
  const [positiveSequenceXohmsperunitlength, setPositiveSequenceXohmsperunitlength] = useState("");
  const [positiveSequenceBseimensperunitlength, setPositiveSequenceBseimensperunitlength] = useState("");
  const [negativeSequenceRohmsperunitlength, setNegativeSequenceRohmsperunitlength] = useState("");
  const [negativeSequenceXohmsperunitlength, setNegativeSequenceXohmsperunitlength] = useState("");
  const [negativeSequenceBseimensperunitlength, setNegativeSequenceBseimensperunitlength] = useState("");
  const [lengthKm, setLengthKm] = useState("");
  const [lineReactorFrom, setLineReactorFrom] = useState("");
  const [lineReactorTo, setLineReactorTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatorData = {
        location1,
        location2,
        type,
        circuitBreakerStatus,
        busFrom,
        busSectionFrom,
        busTo,
        busSectionTo,
        kv,
        positiveSequenceRohmsperunitlength,
        positiveSequenceXohmsperunitlength,
        positiveSequenceBseimensperunitlength,
        negativeSequenceRohmsperunitlength,
        negativeSequenceXohmsperunitlength,
        negativeSequenceBseimensperunitlength,
        lengthKm,
        lineReactorFrom,
        lineReactorTo,
      };

      console.log("Sending data to API:", generatorData);

      const response = await fetch("/api/transmission-line", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatorData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert("Transmission Line created successfully!");
        setLocation1("");
        setLocation2("");
        setType("");
        setCircuitBreakerStatus(false);
        setBusFrom("");
        setBusSectionFrom("");
        setBusTo("");
        setBusSectionTo("");
        setKv("");
        setPositiveSequenceRohmsperunitlength("");
        setPositiveSequenceXohmsperunitlength("");
        setPositiveSequenceBseimensperunitlength("");
        setNegativeSequenceRohmsperunitlength("");
        setNegativeSequenceXohmsperunitlength("");
        setNegativeSequenceBseimensperunitlength("");
        setLengthKm("");
        setLineReactorFrom("");
        setLineReactorTo("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Failed to create generator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Transmission Line</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="location" className="text-base font-normal mb-2">
          location1
          </label>
          <input
            type="text"
            id="location"
            placeholder="location1"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={location1}
            onChange={(e) => setLocation1(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busTo" className="text-base font-normal mb-2">
          location2
          </label>
          <input
            type="text"
            id="busTo"
            placeholder="location2"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionTo" className="text-base font-normal mb-2">
          type
          </label>
          <input
            type="text"
            id="busSectionTo"
            placeholder="type"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
          <label htmlFor="rotor" className="text-base font-normal mb-2">
          busFrom
          </label>
          <input
            type="text"
            id="rotor"
            placeholder="busFrom"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busFrom}
            onChange={(e) => setBusFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mw" className="text-base font-normal mb-2">
          busSectionFrom
          </label>
          <input
            type="text"
            id="mw"
            placeholder="busSectionFrom"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionFrom}
            onChange={(e) => setBusSectionFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kv" className="text-base font-normal mb-2">
          busTo
          </label>
          <input
            type="text"
            id="kv"
            placeholder="busTo"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busTo}
            onChange={(e) => setBusTo(e.target.value)}
          />
        </div>

        {/* Add more fields for other data */}
        <div className="flex flex-col">
          <label
            htmlFor="synchronousReactanceXd"
            className="text-base font-normal mb-2"
          >
            busSectionTo
          </label>
          <input
            type="text"
            id="synchronousReactanceXd"
            placeholder="busSectionTo"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={busSectionTo}
            onChange={(e) => setBusSectionTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="synchronousReactanceXq"
            className="text-base font-normal mb-2"
          >
            kv
          </label>
          <input
            type="text"
            id="synchronousReactanceXq"
            placeholder="kv"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={kv}
            onChange={(e) => setKv(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientReactanceXd"
            className="text-base font-normal mb-2"
          >
            positiveSequenceRohmsperunitlength
          </label>
          <input
            type="text"
            id="transientReactanceXd"
            placeholder="positiveSequenceRohmsperunitlength"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={positiveSequenceRohmsperunitlength}
            onChange={(e) =>
              setPositiveSequenceRohmsperunitlength(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientReactanceXq"
            className="text-base font-normal mb-2"
          >
            positiveSequenceXohmsperunitlength
          </label>
          <input
            type="text"
            id="transientReactanceXq"
            placeholder="positiveSequenceXohmsperunitlength"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={positiveSequenceXohmsperunitlength}
            onChange={(e) => setPositiveSequenceXohmsperunitlength(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientReactanceXd"
            className="text-base font-normal mb-2"
          >
            positiveSequenceBseimensperunitlength
          </label>
          <input
            type="text"
            id="subtransientReactanceXd"
            placeholder="positiveSequenceBseimensperunitlength"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={positiveSequenceBseimensperunitlength}
            onChange={(e) =>
              setPositiveSequenceBseimensperunitlength(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientReactanceXq"
            className="text-base font-normal mb-2"
          >
            negativeSequenceRohmsperunitlength
          </label>
          <input
            type="text"
            id="subtransientReactanceXq"
            placeholder="negativeSequenceRohmsperunitlength"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={negativeSequenceRohmsperunitlength}
            onChange={(e) =>
              setNegativeSequenceRohmsperunitlength(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientOCTimeConstantTd0"
            className="text-base font-normal mb-2"
          >
            negativeSequenceXohmsperunitlength
          </label>
          <input
            type="text"
            id="transientOCTimeConstantTd0"
            placeholder="primaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={negativeSequenceXohmsperunitlength}
            onChange={(e) => setNegativeSequenceXohmsperunitlength(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="transientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            negativeSequenceBseimensperunitlength
          </label>
          <input
            type="text"
            id="transientOCTimeConstantTq0"
            placeholder="negativeSequenceBseimensperunitlength"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={negativeSequenceBseimensperunitlength}
            onChange={(e) =>
              setNegativeSequenceBseimensperunitlength(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTd0"
            className="text-base font-normal mb-2"
          >
            lengthKm
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTd0"
            placeholder="secondaryConnectionGrounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={lengthKm}
            onChange={(e) =>
              setLengthKm(e.target.value)
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            lineReactorFrom
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTq0"
            placeholder="lineReactorFrom"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={lineReactorFrom}
            onChange={(e) =>
              setLineReactorFrom(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="subtransientOCTimeConstantTq0"
            className="text-base font-normal mb-2"
          >
            lineReactorTo
          </label>
          <input
            type="text"
            id="subtransientOCTimeConstantTq0"
            placeholder="lineReactorTo"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={lineReactorTo}
            onChange={(e) =>
              setLineReactorTo(e.target.value)
            }
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
          <Link href="/transmission-line">
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
