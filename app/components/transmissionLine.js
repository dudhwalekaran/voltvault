'use client';

import { useState } from "react";

const TransmissionLineForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    location1: "",
    location2: "",
    type: "",
    circuitBreakerStatus: "",
    busFrom: "",
    busSectionFrom: "",
    busTo: "",
    busSectionTo: "",
    kv: "",
    positiveSequenceRohmsperunitlength: "",
    positiveSequenceXohmsperunitlength: "",
    positiveSequenceBseimensperunitlength: "",
    negativeSequenceRohmsperunitlength: "",
    negativeSequenceXohmsperunitlength: "",
    negativeSequenceBseimensperunitlength: "",
    lengthKm: "",
    lineReactorFrom: "",
    lineReactorTo: "",
    ...initialData, // Populate with existing data if editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transmission Line Details</h2>
      {Object.keys(formData).map((field) => (
        <div key={field} className="mb-2">
          <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      ))}
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default TransmissionLineForm;
