"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function TransmissionLineList() {
  const [transmissions, setTransmissions] = useState([]);
  const [transmissionsData, setTransmissionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadTableAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transmissionsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transmission Line List");
    XLSX.writeFile(wb, "transmission_line_list.xlsx");
  };

  const handleFileUpload = (e) => {
    const file =e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const wb = XLSX.read(binaryStr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setTransmissionsData(data || []);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const fetchTransmissions = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/transmission-line", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setTransmissions(data.transmissionLines || []);
          setTransmissionsData(data.transmissionLines || []);
        } else {
          setError(data.error || "Failed to fetch Transmission Lines");
        }
      } catch (error) {
        console.error("Error fetching Transmission Lines:", error);
        setError("Failed to fetch Transmission Lines due to a network error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransmissions();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/transmission-line/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTransmissions(transmissions.filter((transmission) => transmission._id !== id));
        setTransmissionsData(transmissionsData.filter((transmission) => transmission._id !== id));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete Transmission Line");
      }
    } catch (error) {
      console.error("Error deleting Transmission Line:", error);
      setError("Failed to delete Transmission Line due to a network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-bold text-4xl">
      <h1 className="mb-4">Transmission Line</h1>

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
            <span>Create Transmission Line</span>
            <FaPlus />
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Transmission Line List</h1>
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
                  Transmission Line ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-normal border-r whitespace-nowrap">
                  Location 1
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
                  kV
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
                    colSpan="21"
                    className="text-center py-4 font-normal text-sm"
                  >
                    No Transmission Lines available
                  </td>
                </tr>
              ) : (
                transmissionsData.map((transmission, index) => (
                  <tr key={transmission._id || index} className="border-b">
                    <td className="py-2 px-6 border-r">
                      <input type="checkbox" value={transmission._id} />
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission._id || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.location1 || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.location2 || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.type || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.circuitBreakerStatus || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.busFrom || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.busSectionFrom || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.busTo || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.busSectionTo || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.kv || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.positiveSequenceRohmsperunitlength || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.positiveSequenceXohmsperunitlength || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.positiveSequenceBseimensperunitlength || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.negativeSequenceRohmsperunitlength || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.negativeSequenceXohmsperunitlength || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.negativeSequenceBseimensperunitlength || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.lengthKm || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.lineReactorFrom || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm font-normal border-r">
                      {transmission.lineReactorTo || "N/A"}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <Link
                          href={`/transmission-line/${transmission._id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-normal"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(transmission._id)}
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