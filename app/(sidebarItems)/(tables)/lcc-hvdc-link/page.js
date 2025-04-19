"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function LccList() {
  const [lccs, setLccs] = useState([]);
  const [lccsData, setLccsData] = useState([]);
  const [filteredLccs, setFilteredLccs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(lccsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lcc List");
    XLSX.writeFile(wb, "lcc_list.xlsx");
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
      setLccsData(data || []);
      setFilteredLccs(data || []);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchLccs = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/lcc", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
        }

        const data = await response.json();
        if (response.ok) {
          setLccs(data.lccs || []);
          setLccsData(data.lccs || []);
          setFilteredLccs(data.lccs || []);
        } else {
          setError(data.error || "Failed to fetch Lccs");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch Lccs due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchLccs();
  }, []);

  useEffect(() => {
    let filtered = lccsData;

    if (searchQuery) {
      filtered = filtered.filter((lcc) =>
        (lcc.lcc || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLccs(filtered);
  }, [searchQuery, lccsData]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/lcc/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedLccs = lccs.filter((lcc) => lcc._id !== id);
        setLccs(updatedLccs);
        setLccsData(updatedLccs);
        setFilteredLccs(updatedLccs);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete Lcc");
      }
    } catch (error) {
      setError("Failed to delete Lcc due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
            placeholder="Search by Lcc-hvdc-link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredLccs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 font-normal text-sm">
                    No Lcc-hvdc-links available
                  </td>
                </tr>
              ) : (
                filteredLccs.map((lcc, index) => (
                  <tr key={lcc._id || index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={lcc._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {lcc._id || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {lcc.lcc || "N/A"}
                    </td>
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