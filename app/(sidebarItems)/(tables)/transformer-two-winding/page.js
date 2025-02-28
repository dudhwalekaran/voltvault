"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx"; // Add this for Excel functionality

export default function Generator() {
  const [transformers, setTransformers] = useState([]);
  const [transformersData, setTransformersData] = useState(transformers);

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(generatorsData);
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
      setGeneratorsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchTransformers = async () => {
      try {
        const response = await fetch("/api/transformer-two-winding");
        const data = await response.json();

        if (response.ok) {
          setTransformers(data.transformers); // Set generators if fetch is successful
          setTransformersData(data.transformers); // Set generatorsData for table display
        } else {
          console.error("Failed to fetch generators:", data.error); // Log error if response is not ok
        }
      } catch (error) {
        console.error("Error fetching generators:", error); // Log error in case of network issues
      }
    };

    fetchTransformers();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await fetch(`/api/transformer-two-winding/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted generator from the state
      setTransformers(transformers.filter((transformer) => transformer._id !== id));
      setTransformersData(transformers.filter((transformer) => transformer._id !== id)); // Update generatorsData
    } else {
      alert("Failed to delete generator");
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Two winding transformer</h1>

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

        <Link href="/transformer-two-winding/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Generator</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Transformer List</h1>
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
                  Transformer ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Circuit Breaker Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  busFrom
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  busSectionFrom
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                busTo
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                busSectionTo
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  mva
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  kvprimary
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  kvsecondary
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  r
                </th>
                {/* New columns added */}
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  x
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                TapPrimary
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                TapSecondary
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                primaryWindingConnectio
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                primaryConnectionGrounding
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                secondaryWindingConnection
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                secondaryConnectionGrounding
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Angle
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {transformersData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No Transformer available
                  </td>
                </tr>
              ) : (
                transformersData.map((generator, index) => (
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
                      {generator.circuitBreakerStatus}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.busFrom}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.busSectionFrom}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.busTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.busSectionTo}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.mva}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.kvprimary}
                    </td>
                    {/* New fields added after "KV" */}
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.kvsecondary}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.r}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.x}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.TapPrimary}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.TapSecondary}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.primaryWindingConnection}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.primaryConnectionGrounding}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.secondaryWindingConnection}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.secondaryConnectionGrounding}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.angle}
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
