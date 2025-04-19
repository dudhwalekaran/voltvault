"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function Loads() {
  const [shunts, setShunts] = useState([]);
  const [shuntData, setShuntData] = useState([]);
  const [filteredShunts, setFilteredShunts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(shuntData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shunt Fact List");
    XLSX.writeFile(wb, "shunt_fact_list.xlsx");
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
      setShuntData(data);
      setFilteredShunts(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchShunt = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/shunt-fact", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setShunts(data.shunts || []);
          setShuntData(data.shunts || []);
          setFilteredShunts(data.shunts || []);
        } else {
          setError(data.error || "Failed to fetch Shunt Facts");
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchShunt();
  }, []);

  useEffect(() => {
    let filtered = shuntData;

    if (searchQuery) {
      filtered = filtered.filter((shunt) =>
        (shunt.shunt || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShunts(filtered);
  }, [searchQuery, shuntData]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch(`/api/shunt-fact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const updatedShunts = shunts.filter((shunt) => shunt._id !== id);
        setShunts(updatedShunts);
        setShuntData(updatedShunts);
        setFilteredShunts(updatedShunts);
      } else {
        setError(data.message || "Failed to delete Shunt Fact");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Shunt Fact</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search by Shunt Fact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/shunt-fact/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Shunt Fact</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Shunt Fact List</h1>
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
                  Shunt Fact ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Shunt Fact
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredShunts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 font-normal text-sm">
                    No Shunt Fact available
                  </td>
                </tr>
              ) : (
                filteredShunts.map((shunt, index) => (
                  <tr key={shunt._id || index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={shunt._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{shunt._id}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{shunt.shunt}</td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/shunt-fact/${shunt._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(shunt._id)}
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