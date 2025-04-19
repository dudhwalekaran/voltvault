"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function Loads() {
  const [ibrs, setIbrs] = useState([]);
  const [IbrsData, setIbrsData] = useState(ibrs);
  const [filteredIbrs, setFilteredIbrs] = useState([]); // New state for filtered IBRs
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  // Function to download the table as an Excel file
  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(IbrsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ibr List");
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
      setIbrsData(data);
      setFilteredIbrs(data); // Update filteredIbrs when new data is uploaded
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchIbrs = async () => {
      setLoading(true); // Set loading state
      setError(null); // Reset error state

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/ibr", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setIbrs(data.ibrs || []);
          setIbrsData(data.ibrs || []);
          setFilteredIbrs(data.ibrs || []); // Initialize filteredIbrs
        } else {
          setError(data.error || "Failed to fetch IBRs");
        }
      } catch (error) {
        console.error("Error fetching IBRs:", error);
        setError("Failed to fetch IBRs due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchIbrs();
  }, []);

  // Filter IBRs based on search query (by ibr field)
  useEffect(() => {
    let filtered = IbrsData;

    if (searchQuery) {
      filtered = filtered.filter((ibr) =>
        (ibr.ibr || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIbrs(filtered);
  }, [searchQuery, IbrsData]);

  // Handle delete operation
  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/ibr/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedIbrs = ibrs.filter((ibr) => ibr._id !== id);
        setIbrs(updatedIbrs);
        setIbrsData(updatedIbrs);
        setFilteredIbrs(updatedIbrs); // Update filteredIbrs after deletion
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete IBR");
      }
    } catch (error) {
      console.error("Error deleting IBR:", error);
      alert("Failed to delete IBR due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">IBR</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search by IBR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/ibr/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create IBR</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">IBR List</h1>
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
                  IBR ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  IBR
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredIbrs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 font-normal text-sm">
                    No IBRs available
                  </td>
                </tr>
              ) : (
                filteredIbrs.map((ibr, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={ibr._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{ibr._id}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{ibr.ibr}</td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/ibr/${ibr._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(ibr._id)}
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