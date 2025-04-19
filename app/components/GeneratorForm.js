"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function GeneratorForm() {
  const [formData, setFormData] = useState({
    location: "",
    circuitBreakerStatus: false,
    busTo: "",
    busSectionTo: "",
    type: "",
    rotor: "",
    mw: "",
    mva: "",
    kv: "",
    synchronousReactanceXd: "",
    synchronousReactanceXq: "",
    transientReactanceXd: "",
    transientReactanceXq: "",
    subtransientReactanceXd: "",
    subtransientReactanceXq: "",
    transientOcTimeConstantTd0: "",
    transientOcTimeConstantTq0: "",
    subtransientOcTimeConstantTd0: "",
    subtransientOcTimeConstantTq0: "",
    statorLeakageInductanceXl: "",
    statorResistanceRa: "",
    inertia: "",
    poles: "",
    speed: "",
    frequency: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchGenerator = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/generator/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setFormData({
            location: data.generator.location || "",
            circuitBreakerStatus: data.generator.circuitBreakerStatus || false,
            busTo: data.generator.busTo || "",
            busSectionTo: data.generator.busSectionTo || "",
            type: data.generator.type || "",
            rotor: data.generator.rotor || "",
            mw: data.generator.mw || "",
            mva: data.generator.mva || "",
            kv: data.generator.kv || "",
            synchronousReactanceXd: data.generator.synchronousReactanceXd || "",
            synchronousReactanceXq: data.generator.synchronousReactanceXq || "",
            transientReactanceXd: data.generator.transientReactanceXd || "",
            transientReactanceXq: data.generator.transientReactanceXq || "",
            subtransientReactanceXd: data.generator.subtransientReactanceXd || "",
            subtransientReactanceXq: data.generator.subtransientReactanceXq || "",
            transientOcTimeConstantTd0: data.generator.transientOcTimeConstantTd0 || "",
            transientOcTimeConstantTq0: data.generator.transientOcTimeConstantTq0 || "",
            subtransientOcTimeConstantTd0: data.generator.subtransientOcTimeConstantTd0 || "",
            subtransientOcTimeConstantTq0: data.generator.subtransientOcTimeConstantTq0 || "",
            statorLeakageInductanceXl: data.generator.statorLeakageInductanceXl || "",
            statorResistanceRa: data.generator.statorResistanceRa || "",
            inertia: data.generator.inertia || "",
            poles: data.generator.poles || "",
            speed: data.generator.speed || "",
            frequency: data.generator.frequency || "",
          });
        } else {
          setError(data.message || "Failed to fetch generator");
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerator();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch(`/api/generator/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/generator");
      } else {
        setError(data.message || "Failed to update generator");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const handleCancel = () => {
    router.push("/generator");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Generator: {id}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter Location"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Circuit Breaker Status
              <input
                type="checkbox"
                name="circuitBreakerStatus"
                checked={formData.circuitBreakerStatus}
                onChange={handleChange}
                className="ml-2"
              />
              <span className="ml-1">On/Off</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium">Bus (To)</label>
            <input
              type="text"
              name="busTo"
              value={formData.busTo}
              onChange={handleChange}
              placeholder="Other"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Bus Section (To)</label>
            <input
              type="text"
              name="busSectionTo"
              value={formData.busSectionTo}
              onChange={handleChange}
              placeholder="Bus Section (To)"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter a Value Gas, Hydro or Steam"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Rotor</label>
            <input
              type="text"
              name="rotor"
              value={formData.rotor}
              onChange={handleChange}
              placeholder="Enter a Value Round rotor or Salient rotor"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">MW</label>
            <input
              type="text"
              name="mw"
              value={formData.mw}
              onChange={handleChange}
              placeholder="MW"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">MVA</label>
            <input
              type="text"
              name="mva"
              value={formData.mva}
              onChange={handleChange}
              placeholder="MVA"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kv</label>
            <input
              type="text"
              name="kv"
              value={formData.kv}
              onChange={handleChange}
              placeholder="Kv"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Synchronous Reactance (pu): Xd</label>
            <input
              type="text"
              name="synchronousReactanceXd"
              value={formData.synchronousReactanceXd}
              onChange={handleChange}
              placeholder="Synchronous Reactance (pu): Xd"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Synchronous Reactance (pu): Xq</label>
            <input
              type="text"
              name="synchronousReactanceXq"
              value={formData.synchronousReactanceXq}
              onChange={handleChange}
              placeholder="Synchronous Reactance (pu): Xq"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Transient Reactance (pu): Xd</label>
            <input
              type="text"
              name="transientReactanceXd"
              value={formData.transientReactanceXd}
              onChange={handleChange}
              placeholder="Transient Reactance (pu): Xd"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Transient Reactance (pu): Xq</label>
            <input
              type="text"
              name="transientReactanceXq"
              value={formData.transientReactanceXq}
              onChange={handleChange}
              placeholder="Transient Reactance (pu): Xq"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subtransient Reactance (pu): Xd</label>
            <input
              type="text"
              name="subtransientReactanceXd"
              value={formData.subtransientReactanceXd}
              onChange={handleChange}
              placeholder="Subtransient Reactance (pu): Xd"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subtransient Reactance (pu): Xq</label>
            <input
              type="text"
              name="subtransientReactanceXq"
              value={formData.subtransientReactanceXq}
              onChange={handleChange}
              placeholder="Subtransient Reactance (pu): Xq"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Transient OC Time Constant (seconds): Td0</label>
            <input
              type="text"
              name="transientOcTimeConstantTd0"
              value={formData.transientOcTimeConstantTd0}
              onChange={handleChange}
              placeholder="Transient OC Time Constant (seconds): Td0"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Transient OC Time Constant (seconds): Tq0</label>
            <input
              type="text"
              name="transientOcTimeConstantTq0"
              value={formData.transientOcTimeConstantTq0}
              onChange={handleChange}
              placeholder="Transient OC Time Constant (seconds): Tq0"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subtransient OC Time Constant (seconds): Td0</label>
            <input
              type="text"
              name="subtransientOcTimeConstantTd0"
              value={formData.subtransientOcTimeConstantTd0}
              onChange={handleChange}
              placeholder="Subtransient OC Time Constant (seconds): Td0"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subtransient OC Time Constant (seconds): Tq0</label>
            <input
              type="text"
              name="subtransientOcTimeConstantTq0"
              value={formData.subtransientOcTimeConstantTq0}
              onChange={handleChange}
              placeholder="Subtransient OC Time Constant (seconds): Tq0"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stator Leakage Inductance (pu): Xl</label>
            <input
              type="text"
              name="statorLeakageInductanceXl"
              value={formData.statorLeakageInductanceXl}
              onChange={handleChange}
              placeholder="Stator Leakage Inductance (pu): Xl"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stator resistance (pu): Ra</label>
            <input
              type="text"
              name="statorResistanceRa"
              value={formData.statorResistanceRa}
              onChange={handleChange}
              placeholder="Stator resistance (pu): Ra"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Inertia (MJ/MVA): H</label>
            <input
              type="text"
              name="inertia"
              value={formData.inertia}
              onChange={handleChange}
              placeholder="Inertia (MJ/MVA): H"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Poles</label>
            <input
              type="text"
              name="poles"
              value={formData.poles}
              onChange={handleChange}
              placeholder="Poles"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Speed</label>
            <input
              type="text"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              placeholder="Speed"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Frequency</label>
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="Frequency"
              className="p-2 border rounded-lg w-full"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="p-2 bg-blue-900 text-white rounded-lg w-24">
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 bg-red-500 text-white rounded-lg w-24"
          >
            Cancel
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}