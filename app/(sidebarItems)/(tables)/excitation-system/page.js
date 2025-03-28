"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function ExcitationSystemList() {
  const [excitations, setExcitations] = useState([]);
  const [excitationsData, setExcitationsData] = useState(excitations);

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excitationsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Excitation System List");
    XLSX.writeFile(wb, "excitation_system_list.xlsx");
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
      setExcitationsData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchExcitations = async () => {
      try {
        const response = await fetch("/api/excitation-system");
        const data = await response.json();

        if (response.ok) {
          setExcitations(data.excitations); // Set excitation systems if fetch is successful
          setExcitationsData(data.excitations); // Set excitationsData for table display
        } else {
          console.error("Failed to fetch excitation systems:", data.error);
        }
      } catch (error) {
        console.error("Error fetching excitation systems:", error);
      }
    };

    fetchExcitations();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const response = await fetch(`/api/excitation-system/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted excitation system from the state
      setExcitations(excitations.filter((excitation) => excitation._id !== id));
      setExcitationsData(excitations.filter((excitation) => excitation._id !== id));
    } else {
      alert("Failed to delete excitation system");
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Excitation System</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F5F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/excitation-system/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Excitation System</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Excitation System List</h1>
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
                  Excitation System ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  AVR
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Generator
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  AVR Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  PSS Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  UEL Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  OEL Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {excitationsData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No excitation systems available
                  </td>
                </tr>
              ) : (
                excitationsData.map((excitation, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={excitation._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation._id}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.location}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.avrType}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.generatorDeviceName}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.avrImageUrl ? (
                        <img
                          src={excitation.avrImageUrl}
                          alt="AVR"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.pssImageUrl ? (
                        <img
                          src={excitation.pssImageUrl}
                          alt="PSS"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.uelImageUrl ? (
                        <img
                          src={excitation.uelImageUrl}
                          alt="UEL"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {excitation.oelImageUrl ? (
                        <img
                          src={excitation.oelImageUrl}
                          alt="OEL"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/excitation-system/${excitation._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(excitation._id)}
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