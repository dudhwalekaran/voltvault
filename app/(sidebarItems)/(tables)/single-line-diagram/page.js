"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx"; // Add this for Excel functionality

export default function Bus() {
  const [diagrams, setDiagrams] = useState([]);
  const [diagramsData, setDiagramsData] = useState(diagrams);

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(diagramsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bus List");

    // Download the Excel file
    XLSX.writeFile(wb, "bus_list.xlsx");
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
      setDiagramsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const response = await fetch("/api/single-line-diagram");
        const data = await response.json();

        if (response.ok) {
          setDiagrams(data.diagrams); // Set buses if fetch is successful
          setDiagramsData(data.diagrams); // Set busesData for table display
        } else {
          console.error("Failed to fetch single line diagram:", data.error); // Log error if response is not ok
        }
      } catch (error) {
        console.error("Error fetching single line diagram:", error); // Log error in case of network issues
      }
    };

    fetchDiagrams();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await fetch(`/api/single-line-diagram/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted bus from the state
      setDiagrams(diagrams.filter((diagram) => diagram._id !== id));
      setDiagramsData(diagrams.filter((diagram) => diagram._id !== id)); // Update busesData
    } else {
      alert("Failed to delete single line diagram");
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Single line diagram</h1>

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

        <Link href="/single-line-diagram/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create single line diagram</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">single line diagram List</h1>
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
                  single line diagram ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Description
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {diagramsData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No singe line diagrams available
                  </td>
                </tr>
              ) : (
                diagramsData.map((diagram, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={diagram._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {diagram._id}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {diagram.description}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      <img
                        src={diagram.imageUrl}
                        alt="Diagram"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/single-line-diagram/${diagram._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(diagram._id)}
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
