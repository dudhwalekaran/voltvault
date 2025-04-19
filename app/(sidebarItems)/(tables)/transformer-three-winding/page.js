"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function TransformerThreeWindingList() {
  const [windings, setWindings] = useState([]);
  const [windingsData, setWindingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(windingsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transformer Three Winding List");
    XLSX.writeFile(wb, "transformer_three_winding_list.xlsx");
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
      setWindingsData(data || []);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchWindings = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/transformer-three-winding", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setWindings(data.transformers || []);
          setWindingsData(data.transformers || []);
        } else {
          setError(data.error || "Failed to fetch Transformer Three Windings");
        }
      } catch (error) {
        console.error("Error fetching Transformer Three Windings:", error);
        setError("Failed to fetch Transformer Three Windings due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchWindings();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/transformer-three-winding/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWindings(windings.filter((winding) => winding._id !== id));
        setWindingsData(windingsData.filter((winding) => winding._id !== id));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete Transformer Three Winding");
      }
    } catch (error) {
      console.error("Error deleting Transformer Three Winding:", error);
      setError("Failed to delete Transformer Three Winding due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Transformer Three Winding</h1>

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

        <Link href="/transformer-three-winding/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Transformer Three Winding</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Transformer Three Winding List</h1>
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
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Select</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Transformer ID</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Location</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Circuit Breaker Status</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Bus Primary (From)</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Bus Primary Section (From)</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Bus Secondary (To)</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Bus Section Secondary (To)</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Bus Tertiary (To)</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Bus Section Tertiary (To)</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">MVA</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">kV Primary Voltage</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">kV Secondary Voltage</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">kV Tertiary Voltage</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">PS Primary-Secondary R</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">PS Primary-Secondary X</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">PT Primary-Tertiary R</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">PT Primary-Tertiary X</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">ST Secondary-Tertiary R</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">ST Secondary-Tertiary X</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Tap Primary</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Tap Secondary</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Tap Tertiary</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Primary Connection</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Primary Connection Grounding</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Secondary Connection</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Secondary Connection Grounding</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Tertiary Connection</th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">Tertiary Connection Grounding</th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {windingsData.length === 0 ? (
                <tr>
                  <td colSpan="30" className="text-center py-4 font-normal text-sm">
                    No Transformer Three Windings available
                  </td>
                </tr>
              ) : (
                windingsData.map((winding, index) => (
                  <tr key={winding._id || index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={winding._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding._id || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.location || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.circuitBreakerStatus || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.busprimaryFrom || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.busprimarySectionFrom || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.bussecondaryTo || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.busSectionSecondaryTo || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.bustertiaryTo || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.busSectionTertiaryTo || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.mva || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.kvprimaryVoltage || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.kvsecondaryVoltage || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.kvtertiaryVoltage || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.psprimarysecondaryR || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.psprimarysecondaryX || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.ptprimarytertiaryR || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.ptprimarytertiaryX || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.stsecondarytertiaryR || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.stsecondarytertiaryX || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.TapPrimary || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.TapSecondary || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.TapTertiary || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.primaryConnection || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.primaryConnectionGrounding || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.secondaryConnection || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.secondaryConnectionGrounding || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.tertiaryConnection || "N/A"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{winding.tertiaryConnectionGrounding || "N/A"}</td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/transformer-three-winding/${winding._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(winding._id)}
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