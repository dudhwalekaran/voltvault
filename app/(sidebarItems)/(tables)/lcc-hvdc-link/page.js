'use client';

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from 'next/link'
import * as XLSX from "xlsx"; //

export default function Loads() {
  const [lccs, setLccs] = useState([]);
  const [lccsData, setLccsData] = useState(lccs);

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(lccsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ibr List");

    // Download the Excel file
    XLSX.writeFile(wb, "load_list.xlsx");
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
      setLccsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchLccs = async () => {
      try {
        const response = await fetch("/api/lcc");
        const data = await response.json();

        // Log the response data for debugging
        console.log("API Response:", data);

        if (response.ok) {
          setLccs(data.lccs || []); // Ensure the loades array is being set correctly
          setLccsData(data.lccs || []); // Ensure loadesData is also updated
        } else {
          console.error("Failed to fetch Lcc:", data.error); // Log error if response is not ok
        }
      } catch (error) {
        console.error("Error fetching Lcc:", error); // Log error in case of network issues
      }
    };

    fetchLccs();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await fetch(`/api/lcc/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted load from the state
      setLccs(lccs.filter((lccs) => lccs._id !== id));
      setLccsData(lccs.filter((lccs) => lccs._id !== id)); // Update loadesData
    } else {
      alert("Failed to delete ibr");
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Lcc-hvdc-link</h1>

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

        <Link href="/lcc-hvdc-link/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Lcc-hvdc-link</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Lcc-hvdc-link List</h1>
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
          <table className="min-w-full bg-white mb-5 shadow-md rounded-sm table-auto border border-[#F1F5F9]">
            <thead className="bg-[#F1F5F9]">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Select
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Lcc ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                 Lcc-hvdc-link
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {lccsData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 font-normal text-sm">
                    No Lcc-hvdc-link
                  </td>
                </tr>
              ) : (
                lccsData.map((lcc, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={lcc._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{lcc._id}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{lcc.lcc}</td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/lcc-hvdc-link/${lcc._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(lcc._id)}
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
