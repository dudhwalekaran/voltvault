"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function Bus() {
  const [buses, setBuses] = useState([]);
  const [busesData, setBusesData] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [selectedBuses, setSelectedBuses] = useState([]); // New state for selected buses

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(busesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bus List");
    XLSX.writeFile(wb, "bus_list.xlsx");
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
      setBusesData(data);
      setFilteredBuses(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to fetch buses");
          return;
        }
        const response = await fetch("/api/bus", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setBuses(data.buses);
          setBusesData(data.buses);
          setFilteredBuses(data.buses);
        } else {
          setError(data.error || "Failed to fetch buses");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    const filtered = busesData.filter((bus) =>
      (bus.busName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuses(filtered);
  }, [searchQuery, busesData]);

  // Toggle bus selection
  const handleSelect = (id) => {
    setSelectedBuses((prev) =>
      prev.includes(id) ? prev.filter((busId) => busId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to delete a bus");
        return;
      }
      const response = await fetch(`/api/bus/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete bus");
      }
      const updatedBuses = buses.filter((bus) => bus._id !== id);
      setBuses(updatedBuses);
      setBusesData(updatedBuses);
      setFilteredBuses(updatedBuses);
      setSelectedBuses(selectedBuses.filter((busId) => busId !== id)); // Clear selection
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Bus</h1>
      {error && <div className="mb-4 text-red-500"><p>{error}</p></div>}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search by bus name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>
        <Link href="/bus/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Bus</span>
            <FaPlus />
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Bus List</h1>
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
                  Bus ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Bus Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Voltage Power
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Nominal KV
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 font-normal text-sm">
                    No buses available Lillingtonavailable
                  </td>
                </tr>
              ) : (
                filteredBuses.map((bus) => (
                  <tr key={bus._id} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input
                        type="checkbox"
                        value={bus._id}
                        checked={selectedBuses.includes(bus._id)}
                        onChange={() => handleSelect(bus._id)}
                      />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{bus._id}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{bus.busName}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{bus.location}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{bus.voltagePower}</td>
                    <td className="py-3 px-6 text-sm font-normal border-r">{bus.nominalKV}</td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/bus/${bus._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        {selectedBuses.includes(bus._id) && (
                          <button
                            onClick={() => handleDelete(bus._id)}
                            className="text-red-500 hover:text-red-700 text-sm font-normal"
                          >
                            Delete
                          </button>
                        )}
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
