"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function Loads() {
  const [loads, setLoads] = useState([]);
  const [loadsData, setLoadsData] = useState(loads);
  const [filteredLoads, setFilteredLoads] = useState([]); // New state for filtered loads
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(loadsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Load List");
    XLSX.writeFile(wb, "load_list.xlsx");
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
      setLoadsData(data);
      setFilteredLoads(data); // Update filteredLoads when new data is uploaded
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchLoads = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/load", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setLoads(data.loads || []);
          setLoadsData(data.loads || []);
          setFilteredLoads(data.loads || []); // Initialize filteredLoads
        } else {
          setError(data.error || "Failed to fetch Loads");
        }
      } catch (error) {
        console.error("Error fetching loads:", error);
        setError("Failed to fetch Loads due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, []);

  // Filter loads based on search query (by location)
  useEffect(() => {
    let filtered = loadsData;

    if (searchQuery) {
      filtered = filtered.filter((load) =>
        (load.location || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLoads(filtered);
  }, [searchQuery, loadsData]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/load/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedLoads = loads.filter((load) => load._id !== id);
        setLoads(updatedLoads);
        setLoadsData(updatedLoads);
        setFilteredLoads(updatedLoads); // Update filteredLoads after deletion
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete Load");
      }
    } catch (error) {
      console.error("Error deleting Load:", error);
      setError("Failed to delete Load due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Loads</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search by bus location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/load/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Load</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Load List</h1>
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
                  Load ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Circuit Breaker
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus (From)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus Section (From)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  P (Mw)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Q (Mvar)
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLoads.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 font-normal text-sm">
                    No loads available
                  </td>
                </tr>
              ) : (
                filteredLoads.map((load, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={load._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load._id}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load.location}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load.circuitBreaker ? "Yes" : "No"}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load.busFrom}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load.busSectionFrom}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load.pmw}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{load.qmvar}</td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/load/${load._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(load._id)}
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