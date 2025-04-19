"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function Generator() {
  const [generators, setGenerators] = useState([]);
  const [generatorsData, setGeneratorsData] = useState(generators);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(generatorsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Generator List");
    XLSX.writeFile(wb, "generator_list.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const wb = XLSX.read(binaryStr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setGeneratorsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchGenerators = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generator", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setGenerators(data.generators || []);
          setGeneratorsData(data.generators || []);
        } else {
          setError(data.error || "Failed to fetch Generators");
        }
      } catch (error) {
        console.error("Error fetching generators:", error);
        setError("Failed to fetch Generators due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerators();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/generator/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGenerators(generators.filter((generator) => generator._id !== id));
        setGeneratorsData(generatorsData.filter((generator) => generator._id !== id));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete Generator");
      }
    } catch (error) {
      console.error("Error deleting Generator:", error);
      setError("Failed to delete Generator due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Generator</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/generator/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Generator</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Generator List</h1>
      <div className="container mx-auto my-6 px-4 border border-gray-300 shadow-xl rounded-lg">
        <div className="mb-4 flex justify-between">
          <div className="space-x-4">
            <button
              onClick={downloadTableAsExcel}
              className="bg-[#D1D5DB] py-3 text-black px-4 rounded-md text-xs"
            >
              Download as Excel
            </button>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="bg-gray-200 p-2 rounded-md text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md mb-5 rounded-sm table-auto border border-[#F1F5F9]">
            <thead className="bg-[#F1F5F9]">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Select
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Generator ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  busTo
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  busSectionTo
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  type
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  rotor
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  MW
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  MVA
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  KV
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Synchronous Reactance (pu): Xd
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Synchronous Reactance (pu): Xq
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Transient Reactance (pu): Xd
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Transient Reactance (pu): Xq
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Subtransient Reactance (pu): Xd
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Subtransient Reactance (pu): Xq
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Transient OC Time Constant (seconds): Td0
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Transient OC Time Constant (seconds): Tq0
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Subtransient OC Time Constant (seconds): Td0
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Subtransient OC Time Constant (seconds): Tq0
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Stator Leakage Inductance (pu): Xl
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Stator resistance (pu): Ra
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Inertia (MJ/MVA): H
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Poles
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Speed
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Frequency
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {generatorsData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No generators available
                  </td>
                </tr>
              ) : (
                generatorsData.map((generator, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={generator._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator._id}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.location}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.busTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.busSectionTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.type}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.rotor}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.mw}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.mva}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.kv}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.synchronousReactancePuXd}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.synchronousReactancePuXq}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.transientReactancePuXdPrime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.transientReactancePuXqPrime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.subtransientReactancePuXdPrimePrime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.subtransientReactancePuXqPrimePrime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.transientOCTimeConstantSecondsTd0Prime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.transientOCTimeConstantSecondsTq0Prime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.subtransientOCTimeConstantSecondsTd0PrimePrime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.subtransientOCTimeConstantSecondsTq0PrimePrime}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.statorLeakageInductancePuXl}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.statorResistancePuRa}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.inertiaMJMVAH}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.poles}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.speed}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.frequency}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/generator/${generator._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(generator._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-normal"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}