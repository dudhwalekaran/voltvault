"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function TurbineList() {
  const [turbines, setTurbines] = useState([]);
  const [turbinesData, setTurbinesData] = useState([]);
  const [filteredTurbines, setFilteredTurbines] = useState([]); // New state for filtered turbines
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(turbinesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Turbine List");
    XLSX.writeFile(wb, "turbine_list.xlsx");
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
      setTurbinesData(data || []);
      setFilteredTurbines(data || []); // Update filteredTurbines when new data is uploaded
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchTurbines = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      console.log("Token from localStorage:", token); // Debug: Log token
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/turbine", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text(); // Debug: Log raw response
        console.log("Raw Response:", text);
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          setError("Invalid response format from server");
          setLoading(false);
          return;
        }
        console.log("Parsed API Response:", data); // Debug: Log parsed response

        if (response.ok) {
          setTurbines(data.turbines || []);
          setTurbinesData(data.turbines || []);
          setFilteredTurbines(data.turbines || []); // Initialize filteredTurbines
        } else {
          setError(data.error || `Failed to fetch turbines (Status: ${response.status})`);
        }
      } catch (error) {
        console.error("Error fetching turbines:", error);
        setError("Failed to fetch turbines due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchTurbines();
  }, []);

  // Filter turbines based on search query (by location, turbineType, and deviceName)
  useEffect(() => {
    let filtered = turbinesData;

    if (searchQuery) {
      filtered = filtered.filter((turbine) =>
        (turbine.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (turbine.turbineType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (turbine.deviceName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTurbines(filtered);
  }, [searchQuery, turbinesData]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    console.log("Token from localStorage (delete):", token); // Debug: Log token
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/turbine/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text(); // Debug: Log raw response
      console.log("Delete Raw Response:", text);
      const data = text ? JSON.parse(text) : {};
      console.log("Delete Parsed API Response:", data); // Debug: Log parsed response

      if (response.ok) {
        const updatedTurbines = turbines.filter((turbine) => turbine._id !== id);
        setTurbines(updatedTurbines);
        setTurbinesData(updatedTurbines);
        setFilteredTurbines(updatedTurbines); // Update filteredTurbines after deletion
      } else {
        alert(data.error || "Failed to delete turbine");
      }
    } catch (error) {
      console.error("Error deleting turbine:", error);
      alert("Failed to delete turbine due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Turbine</h1>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative w-[85%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search by location, turbine type, or device name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        <Link href="/turbine-governor/create">
          <button className="bg-[#4B66BE] text-white text-sm px-4 py-3 rounded-lg hover:bg-[#4B66BE] flex items-center justify-center space-x-2">
            <span>Create Turbine</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Turbine List</h1>
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
                  Turbine ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Turbine Type
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Device Name
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
              {filteredTurbines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 font-normal text-sm">
                    No turbines available
                  </td>
                </tr>
              ) : (
                filteredTurbines.map((turbine, index) => (
                  <tr key={turbine._id || index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={turbine._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {turbine._id || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {turbine.location || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {turbine.turbineType || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {turbine.deviceName || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {turbine.imageUrl ? (
                        <img
                          src={turbine.imageUrl}
                          alt="Diagram"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/turbine-governor/${turbine._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(turbine._id)}
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