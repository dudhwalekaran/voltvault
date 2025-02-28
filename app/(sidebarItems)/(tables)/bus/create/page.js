"use client";

import { useState } from "react";
import Link from "next/link";

const InputField = ({ id, label, placeholder, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-base font-normal mb-2">
      {label}
    </label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      className="p-2 border border-gray-300 font-normal text-base rounded-lg"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function BusCreate() {
  const [formData, setFormData] = useState({
    busName: "",
    location: "",
    voltagePower: "",
    nominalKv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Bus created successfully!");
        setFormData({ busName: "", location: "", voltagePower: "", nominalKV: "" });
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to create bus");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { id: "busName", label: "Bus Name", placeholder: "Enter Bus Name" },
    { id: "location", label: "Location", placeholder: "Enter Location" },
    { id: "voltagePower", label: "Voltage Power", placeholder: "Enter Voltage Power" },
    { id: "nominalKV", label: "Nominal KV", placeholder: "Enter Nominal KV" },
  ];

  return (
    <div className="m-4 font-bold text-3xl">
      <h1>Create Bus</h1>
      <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={formData[field.id]}
            onChange={handleChange}
          />
        ))}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex space-x-4 mt-5">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-56 font-medium text-base py-2 px-6 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
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
