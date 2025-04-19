"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TransmissionLineForm({ id }) {
  const [formData, setFormData] = useState({
    location1: "",
    location2: "",
    type: "",
    circuitBreakerStatus: false,
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state for better debugging
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        console.log("Fetching data for ID:", id); // Debug log
        const response = await fetch(`/api/transmission-line/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (data.success && data.transmissionLine) {
          setFormData({
            location1: data.transmissionLine.location1 || "",
            location2: data.transmissionLine.location2 || "",
            type: data.transmissionLine.type || "",
            circuitBreakerStatus: data.transmissionLine.circuitBreakerStatus || false,
            busFrom: data.transmissionLine.busFrom || "",
            busSectionFrom: data.transmissionLine.busSectionFrom || "",
            busTo: data.transmissionLine.busTo || "",
            busSectionTo: data.transmissionLine.busSectionTo || "",
            kv: data.transmissionLine.kv || "",
            positiveSequenceRohmsperunitlength: data.transmissionLine.positiveSequenceRohmsperunitlength || "",
            positiveSequenceXohmsperunitlength: data.transmissionLine.positiveSequenceXohmsperunitlength || "",
            positiveSequenceBseimensperunitlength: data.transmissionLine.positiveSequenceBseimensperunitlength || "",
            negativeSequenceRohmsperunitlength: data.transmissionLine.negativeSequenceRohmsperunitlength || "",
            negativeSequenceXohmsperunitlength: data.transmissionLine.negativeSequenceXohmsperunitlength || "",
            negativeSequenceBseimensperunitlength: data.transmissionLine.negativeSequenceBseimensperunitlength || "",
            lengthKm: data.transmissionLine.lengthKm || "",
            lineReactorFrom: data.transmissionLine.lineReactorFrom || "",
            lineReactorTo: data.transmissionLine.lineReactorTo || "",
          });
          console.log("Form data set:", formData); // Debug log
        } else {
          throw new Error(data.message || "Failed to load transmission line data");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("No ID provided for editing");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch(`/api/transmission-line/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update transmission line");

      router.push("/transmission-line");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update transmission line: " + error.message);
    }
  };

  const handleCancel = () => {
    router.push("/transmission-line");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500 m-4">{error}</p>;

  return (
    <div className="m-4 font-bold text-3xl">
      <h1 className="mb-6">Transmission Line Edit: {id}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="mb-2">
          <label className="block text-sm font-normal mb-2">Location 1</label>
          <input
            type="text"
            name="location1"
            value={formData.location1}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-normal mb-2">Location 2</label>
          <input
            type="text"
            name="location2"
            value={formData.location2}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-normal mb-2">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-normal mb-2">Circuit Breaker Status</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="circuitBreakerStatus"
              checked={formData.circuitBreakerStatus}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-normal">
              {formData.circuitBreakerStatus ? "On" : "Off"}
            </span>
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-normal mb-2">Bus From</label>
          <input
            type="text"
            name="busFrom"
            value={formData.busFrom}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Bus Section From</label>
          <input
            type="text"
            name="busSectionFrom"
            value={formData.busSectionFrom}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Bus To</label>
          <input
            type="text"
            name="busTo"
            value={formData.busTo}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Bus Section To</label>
          <input
            type="text"
            name="busSectionTo"
            value={formData.busSectionTo}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Kv</label>
          <input
            type="text"
            name="kv"
            value={formData.kv}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Positive sequence: R(ohms/perunitlength)</label>
          <input
            type="text"
            name="positiveSequenceRohmsperunitlength"
            value={formData.positiveSequenceRohmsperunitlength}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Positive sequence: X(ohms/perunitlength)</label>
          <input
            type="text"
            name="positiveSequenceXohmsperunitlength"
            value={formData.positiveSequenceXohmsperunitlength}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Positive sequence: B(seimens/perunitlength)</label>
          <input
            type="text"
            name="positiveSequenceBseimensperunitlength"
            value={formData.positiveSequenceBseimensperunitlength}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Negative sequence: R(ohms/perunitlength)</label>
          <input
            type="text"
            name="negativeSequenceRohmsperunitlength"
            value={formData.negativeSequenceRohmsperunitlength}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Negative sequence: X(ohms/perunitlength)</label>
          <input
            type="text"
            name="negativeSequenceXohmsperunitlength"
            value={formData.negativeSequenceXohmsperunitlength}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Negative sequence: B(seimens/perunitlength)</label>
          <input
            type="text"
            name="negativeSequenceBseimensperunitlength"
            value={formData.negativeSequenceBseimensperunitlength}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Length (km)</label>
          <input
            type="text"
            name="lengthKm"
            value={formData.lengthKm}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Line Reactor (From)</label>
          <input
            type="text"
            name="lineReactorFrom"
            value={formData.lineReactorFrom}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-normal mb-2">Line Reactor (To)</label>
          <input
            type="text"
            name="lineReactorTo"
            value={formData.lineReactorTo}
            onChange={handleChange}
            className="w-full h-[40px] pl-3 pr-4 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Update and Cancel buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-48 py-2 px-6 font-normal text-base rounded-lg hover:bg-blue-600"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-[#EF4444] text-white w-48 py-2 px-6 font-normal text-base rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}