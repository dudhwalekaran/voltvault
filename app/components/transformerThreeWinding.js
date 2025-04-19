"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function TransformerThreeWinding({ transformerData: initialData }) {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    location: "",
    circuitBreakerStatus: false,
    busprimaryFrom: "",
    busprimarySectionFrom: "",
    bussecondaryTo: "",
    busSectionSecondaryTo: "",
    bustertiaryTo: "",
    busSectionTertiaryTo: "",
    mva: "",
    kvprimaryVoltage: "",
    kvsecondaryVoltage: "",
    kvtertiaryVoltage: "",
    psprimarysecondaryR: "",
    psprimarysecondaryX: "",
    ptprimarytertiaryR: "",
    ptprimarytertiaryX: "",
    stsecondarytertiaryR: "",
    stsecondarytertiaryX: "",
    tapPrimary: "",
    tapSecondary: "",
    tapTertiary: "",
    primaryConnection: "",
    primaryConnectionGrounding: "",
    secondaryConnection: "",
    secondaryConnectionGrounding: "",
    tertiaryConnection: "",
    tertiaryConnectionGrounding: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        location: initialData.location || "",
        circuitBreakerStatus: initialData.circuitBreakerStatus === "On",
        busprimaryFrom: initialData.busprimaryFrom || "",
        busprimarySectionFrom: initialData.busprimarySectionFrom || "",
        bussecondaryTo: initialData.bussecondaryTo || "",
        busSectionSecondaryTo: initialData.busSectionSecondaryTo || "",
        bustertiaryTo: initialData.bustertiaryTo || "",
        busSectionTertiaryTo: initialData.busSectionTertiaryTo || "",
        mva: initialData.mva || "",
        kvprimaryVoltage: initialData.kvprimaryVoltage || "",
        kvsecondaryVoltage: initialData.kvsecondaryVoltage || "",
        kvtertiaryVoltage: initialData.kvtertiaryVoltage || "",
        psprimarysecondaryR: initialData.psprimarysecondaryR || "",
        psprimarysecondaryX: initialData.psprimarysecondaryX || "",
        ptprimarytertiaryR: initialData.ptprimarytertiaryR || "",
        ptprimarytertiaryX: initialData.ptprimarytertiaryX || "",
        stsecondarytertiaryR: initialData.stsecondarytertiaryR || "",
        stsecondarytertiaryX: initialData.stsecondarytertiaryX || "",
        tapPrimary: initialData.TapPrimary || "",
        tapSecondary: initialData.TapSecondary || "",
        tapTertiary: initialData.TapTertiary || "",
        primaryConnection: initialData.primaryConnection || "",
        primaryConnectionGrounding: initialData.primaryConnectionGrounding || "",
        secondaryConnection: initialData.secondaryConnection || "",
        secondaryConnectionGrounding: initialData.secondaryConnectionGrounding || "",
        tertiaryConnection: initialData.tertiaryConnection || "",
        tertiaryConnectionGrounding: initialData.tertiaryConnectionGrounding || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.location || !formData.mva || !formData.kvprimaryVoltage) {
      setError("Location, MVA, and Primary Voltage are required.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(`/api/transformer-three-winding/${id || initialData?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          circuitBreakerStatus: formData.circuitBreakerStatus ? "On" : "Off",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update transformer");
      }

      alert("Transformer updated successfully!");
      router.push("/transformer-three-winding");
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData && !id) {
    return <div>No transformer data provided for editing</div>;
  }

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Edit Transformer Three Winding</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
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
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
            required
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
              name="circuitBreakerStatus"
              checked={formData.circuitBreakerStatus}
              onChange={handleChange}
              className="form-checkbox"
              disabled={loading}
            />
            <span className="ml-2">On/Off</span>
          </label>
        </div>

        <div className="flex flex-col">
          <label htmlFor="busprimaryFrom" className="text-base font-normal mb-2">
            Bus Primary From
          </label>
          <input
            type="text"
            id="busprimaryFrom"
            name="busprimaryFrom"
            placeholder="Enter Bus Primary From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.busprimaryFrom}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busprimarySectionFrom" className="text-base font-normal mb-2">
            Bus Primary Section From
          </label>
          <input
            type="text"
            id="busprimarySectionFrom"
            name="busprimarySectionFrom"
            placeholder="Enter Bus Primary Section From"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.busprimarySectionFrom}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bussecondaryTo" className="text-base font-normal mb-2">
            Bus Secondary To
          </label>
          <input
            type="text"
            id="bussecondaryTo"
            name="bussecondaryTo"
            placeholder="Enter Bus Secondary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.bussecondaryTo}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionSecondaryTo" className="text-base font-normal mb-2">
            Bus Section Secondary To
          </label>
          <input
            type="text"
            id="busSectionSecondaryTo"
            name="busSectionSecondaryTo"
            placeholder="Enter Bus Section Secondary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.busSectionSecondaryTo}
            onChange={handleChange}
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
            name="bustertiaryTo"
            placeholder="Enter Bus Tertiary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.bustertiaryTo}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="busSectionTertiaryTo" className="text-base font-normal mb-2">
            Bus Section Tertiary To
          </label>
          <input
            type="text"
            id="busSectionTertiaryTo"
            name="busSectionTertiaryTo"
            placeholder="Enter Bus Section Tertiary To"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.busSectionTertiaryTo}
            onChange={handleChange}
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
            name="mva"
            placeholder="Enter MVA"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.mva}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kvprimaryVoltage" className="text-base font-normal mb-2">
            KV Primary Voltage
          </label>
          <input
            type="text"
            id="kvprimaryVoltage"
            name="kvprimaryVoltage"
            placeholder="Enter KV Primary Voltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.kvprimaryVoltage}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kvsecondaryVoltage" className="text-base font-normal mb-2">
            KV Secondary Voltage
          </label>
          <input
            type="text"
            id="kvsecondaryVoltage"
            name="kvsecondaryVoltage"
            placeholder="Enter KV Secondary Voltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.kvsecondaryVoltage}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kvtertiaryVoltage" className="text-base font-normal mb-2">
            KV Tertiary Voltage
          </label>
          <input
            type="text"
            id="kvtertiaryVoltage"
            name="kvtertiaryVoltage"
            placeholder="Enter KV Tertiary Voltage"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.kvtertiaryVoltage}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="psprimarysecondaryR" className="text-base font-normal mb-2">
            PS Primary-Secondary R
          </label>
          <input
            type="text"
            id="psprimarysecondaryR"
            name="psprimarysecondaryR"
            placeholder="Enter PS Primary-Secondary R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.psprimarysecondaryR}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="psprimarysecondaryX" className="text-base font-normal mb-2">
            PS Primary-Secondary X
          </label>
          <input
            type="text"
            id="psprimarysecondaryX"
            name="psprimarysecondaryX"
            placeholder="Enter PS Primary-Secondary X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.psprimarysecondaryX}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="ptprimarytertiaryR" className="text-base font-normal mb-2">
            PT Primary-Tertiary R
          </label>
          <input
            type="text"
            id="ptprimarytertiaryR"
            name="ptprimarytertiaryR"
            placeholder="Enter PT Primary-Tertiary R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.ptprimarytertiaryR}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="ptprimarytertiaryX" className="text-base font-normal mb-2">
            PT Primary-Tertiary X
          </label>
          <input
            type="text"
            id="ptprimarytertiaryX"
            name="ptprimarytertiaryX"
            placeholder="Enter PT Primary-Tertiary X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.ptprimarytertiaryX}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="stsecondarytertiaryR" className="text-base font-normal mb-2">
            ST Secondary-Tertiary R
          </label>
          <input
            type="text"
            id="stsecondarytertiaryR"
            name="stsecondarytertiaryR"
            placeholder="Enter ST Secondary-Tertiary R"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.stsecondarytertiaryR}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="stsecondarytertiaryX" className="text-base font-normal mb-2">
            ST Secondary-Tertiary X
          </label>
          <input
            type="text"
            id="stsecondarytertiaryX"
            name="stsecondarytertiaryX"
            placeholder="Enter ST Secondary-Tertiary X"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.stsecondarytertiaryX}
            onChange={handleChange}
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
            name="tapPrimary"
            placeholder="Enter Tap Primary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.tapPrimary}
            onChange={handleChange}
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
            name="tapSecondary"
            placeholder="Enter Tap Secondary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.tapSecondary}
            onChange={handleChange}
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
            name="tapTertiary"
            placeholder="Enter Tap Tertiary"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.tapTertiary}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="primaryConnection" className="text-base font-normal mb-2">
            Primary Connection
          </label>
          <input
            type="text"
            id="primaryConnection"
            name="primaryConnection"
            placeholder="Enter Primary Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.primaryConnection}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="primaryConnectionGrounding" className="text-base font-normal mb-2">
            Primary Connection Grounding
          </label>
          <input
            type="text"
            id="primaryConnectionGrounding"
            name="primaryConnectionGrounding"
            placeholder="Enter Primary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.primaryConnectionGrounding}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryConnection" className="text-base font-normal mb-2">
            Secondary Connection
          </label>
          <input
            type="text"
            id="secondaryConnection"
            name="secondaryConnection"
            placeholder="Enter Secondary Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.secondaryConnection}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryConnectionGrounding" className="text-base font-normal mb-2">
            Secondary Connection Grounding
          </label>
          <input
            type="text"
            id="secondaryConnectionGrounding"
            name="secondaryConnectionGrounding"
            placeholder="Enter Secondary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.secondaryConnectionGrounding}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tertiaryConnection" className="text-base font-normal mb-2">
            Tertiary Connection
          </label>
          <input
            type="text"
            id="tertiaryConnection"
            name="tertiaryConnection"
            placeholder="Enter Tertiary Connection"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.tertiaryConnection}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tertiaryConnectionGrounding" className="text-base font-normal mb-2">
            Tertiary Connection Grounding
          </label>
          <input
            type="text"
            id="tertiaryConnectionGrounding"
            name="tertiaryConnectionGrounding"
            placeholder="Enter Tertiary Connection Grounding"
            className="p-2 border border-gray-300 font-normal text-base rounded-lg"
            value={formData.tertiaryConnectionGrounding}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex space-x-4 mt-5 col-span-2">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <Link href="/transformer-three-winding">
            <button
              type="button"
              className="bg-[#EF4444] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-red-600 disabled:opacity-50"
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