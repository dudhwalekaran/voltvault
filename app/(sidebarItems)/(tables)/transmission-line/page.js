"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx"; // Add this for Excel functionality

export default function Generator() {
  const [transmissions, setTransmissions] = useState([]);
  const [transmissionsData, setTransmissionsData] = useState([]); // Default to an empty array

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transmissionsData);
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
      setTransmissionsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchTransmissions = async () => {
      try {
        const response = await fetch("/api/transmission-line");
        const data = await response.json();

        if (response.ok) {
          setTransmissions(data.transmissionLines || []); // Ensure the data is an array
          setTransmissionsData(data.transmissionLines || []); // Ensure the data is an array for table display
        } else {
          console.error("Failed to fetch generators:", data.error); // Log error if response is not ok
        }
      } catch (error) {
        console.error("Error fetching generators:", error); // Log error in case of network issues
      }
    };

    fetchTransmissions();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await fetch(`/api/transmission-line/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted generator from the state
      setTransmissions(transmissions.filter((transmission) => transmission._id !== id));
      setTransmissionsData(transmissions.filter((transmission) => transmission._id !== id)); // Update generatorsData
    } else {
      alert("Failed to delete generator");
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Transmission line</h1>

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

        <Link href="/transmission-line/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create transmission line</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Transmission Line List</h1>
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
                  transmission ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location1
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location 2
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Type
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Circuit Breaker Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus From
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus Section From
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus To
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus Section To
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  KV
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Positive Sequence R (ohms/unit length)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Positive Sequence X (ohms/unit length)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Positive Sequence B (siemens/unit length)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Negative Sequence R (ohms/unit length)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Negative Sequence X (ohms/unit length)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Negative Sequence B (siemens/unit length)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Length (km)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Line Reactor From
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Line Reactor To
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {transmissionsData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No transmission available
                  </td>
                </tr>
              ) : (
                transmissionsData.map((generator, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={generator._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator._id}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.location1}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.location2}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.type}
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
                      {generator.kv}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.positiveSequenceRohmsperunitlength}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.positiveSequenceXohmsperunitlength}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.positiveSequenceBseimensperunitlength}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.negativeSequenceRohmsperunitlength}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.negativeSequenceXohmsperunitlength}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.negativeSequenceBseimensperunitlength}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.lengthKm}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.lineReactorFrom}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {generator.lineReactorTo}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/transmission-line/${generator._id}`}
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
