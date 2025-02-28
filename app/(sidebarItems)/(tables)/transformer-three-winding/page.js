"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx"; // Add this for Excel functionality

export default function Generator() {
  const [windings, setWindings] = useState([]);
  const [windingsData, setWindingsData] = useState(windings);

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(windingsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Generator List");

    // Download the Excel file
    XLSX.writeFile(wb, "generator_list.xlsx");
  };

  // Function to handle file upload and parse Excel data
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const wb = XLSX.read(binaryStr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      // Set the data to the state to render in the table
      setWindingsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchWindings = async () => {
      try {
        const response = await fetch("/api/transformer-three-winding");
        const data = await response.json();

        if (response.ok) {
          setWindings(data.windings); // Set generators if fetch is successful
          setWindingsData(data.windings); // Set generatorsData for table display
        } else {
          console.error("Failed to fetch generators:", data.error); // Log error if response is not ok
        }
      } catch (error) {
        console.error("Error fetching generators:", error); // Log error in case of network issues
      }
    };

    fetchWindings();
  }, []);  
  

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await fetch(`/api/transformer-three-winding/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted generator from the state
      setWindings(windings.filter((winding) => winding._id !== id));
      setWindingsData(windings.filter((winding) => winding._id !== id)); // Update generatorsData
    } else {
      alert("Failed to delete winding");
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Transformers Three Winding</h1>

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
            <span>Create Winding</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">winding List</h1>
      <div className="container mx-auto my-6 px-4 border border-gray-300 shadow-xl rounded-lg">
        {/* Options to upload and download */}
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

        {/* Wrapper for horizontal scrolling */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md mb-5 rounded-sm table-auto border border-[#F1F5F9]">
            <thead className="bg-[#F1F5F9]">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Select
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  winding ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Circuit breaker status
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus_primary (from)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus_secondary(to)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  busSection_secondary(to)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus_Tertiary(to)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  busSection_tertiary (to)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  MVA
                </th>
                {/* New columns added */}
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  kV-primary voltage
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  ps (primary-tertiary): R
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  pt (primary-tertiary): X
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  st (secondary-tertiary): R
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  pt (primary-tertiary): X
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  st (secondary-tertiary): R
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  pt (primary-tertiary): X
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  st (secondary-tertiary): R
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  st (secondary-tertiary): X
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  % tap (primary)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  % tap (secondary)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  % tap (tertiary)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  primary connection
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  primary connection grounding
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  secondary connection
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  secondary connection grounding
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  tertiary connection
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  tertiary connection grounding
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
            {windingsData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No Transformer available
                  </td>
                </tr>
              ) : (
                windingsData.map((winding, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={winding._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding._id}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.location}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.circuitBreakerStatus}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.busprimaryFrom}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.busprimarySectionFrom}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.bussecondaryTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.busSectionSecondaryTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.bustertiaryTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.busSectionTertiaryTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.mva}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.kvprimaryVoltage}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.kvsecondaryVoltage}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.kvtertiaryVoltage}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.psprimarysecondaryR}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.psprimarysecondaryX}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.ptprimarytertiaryR}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.ptprimarytertiaryX}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.stsecondarytertiaryR}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.stsecondarytertiaryX}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.TapPrimary}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.TapSecondary}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.TapTertiary}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.primaryConnection}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.primaryConnectionGrounding}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.secondaryConnection}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.secondaryConnectionGrounding}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.tertiaryConnection}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {winding.tertiaryConnectionGrounding}
                    </td>
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
