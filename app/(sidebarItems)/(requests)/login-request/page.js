"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function LoginRequest() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(""); // Add state for success/error message
  const recordsPerPage = 20;
  const [showPopup, setShowPopup] = useState(null);

  // Function to fetch users (reused for refreshing after actions)
  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await fetch("/api/fetch-login-user");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setUsers(data.map((user) => ({ ...user, password: undefined })));
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setMessage(`Error fetching users: ${error.message}`);
    }
  };

  const handlePopupAction = async (action, user) => {
    try {
      let response;

      switch (action) {
        case "accept":
        case "reject":
          response = await fetch(
            `/api/userAction?action=${action}&id=${user._id}`,
            {
              method: "POST",
            }
          );
          break;

        case "delete":
          response = await fetch(
            `/api/userAction?action=${action}&id=${user._id}`,
            {
              method: "DELETE",
            }
          );
          break;

        default:
          console.error("Unknown action");
          setMessage("Unknown action");
          return;
      }

      const result = await response.json();
      console.log("Action result:", result);

      if (response.ok && result.success) {
        setMessage(result.message); // Display the success message
        await fetchUsers(); // Refresh the user list
        if (action === "delete") {
          setUsers(users.filter((u) => u._id !== user._id));
        }
      } else {
        setMessage(result.message || "Action failed");
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      setMessage(`Error performing ${action}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate pagination values
  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function generateInitials(name) {
    if (typeof name !== "string" || name.trim() === "") {
      return "";
    }

    const nameParts = name.trim().split(" ").filter(Boolean);
    if (nameParts.length === 0) {
      return "";
    }

    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    return initials;
  }

  function getRandomBgColor() {
    const colors = [
      "bg-blue-600",
      "bg-[#FBCEB1]",
      "bg-[#B2BEB5]",
      "bg-[#89CFF0]",
      "bg-green-500",
      "bg-[#9F8170]",
      "bg-[#9C2542]",
      "bg-[#967117]",
      "bg-red-500",
      "bg-[#3B3C36]",
      "bg-[#ACE5EE]",
      "bg-[#0093AF]",
      "bg-purple-600",
      "bg-[#333399]",
      "bg-[#5072A7]",
      "bg-[#FFAA1D]",
      "bg-yellow-500",
      "bg-[#D891EF]",
      "bg-[#FFC680]",
      "bg-[#006B3C]",
      "bg-[#B0BF1A]",
      "bg-[#C88A65]",
      "bg-[#841B2D]",
      "bg-[#848482]",
      "bg-[#FF5733]",
      "bg-[#33FF57]",
      "bg-[#3357FF]",
      "bg-[#A52A2A]",
      "bg-[#8A2BE2]",
      "bg-[#7FFF00]",
      "bg-[#D2691E]",
      "bg-[#FF1493]",
      "bg-[#00BFFF]",
      "bg-[#ADFF2F]",
      "bg-[#FFD700]",
      "bg-[#FF0000]",
      "bg-[#00FF00]",
      "bg-[#0000FF]",
      "bg-[#FF4500]",
      "bg-[#DA70D6]",
      "bg-[#00CED1]",
      "bg-[#FF69B4]",
      "bg-[#32CD32]",
      "bg-[#FFB6C1]",
      "bg-[#4682B4]",
      "bg-[#8B4513]",
      "bg-[#D3D3D3]",
      "bg-[#6A5ACD]",
      "bg-[#FF6347]",
      "bg-[#9ACD32]",
      "bg-[#B8860B]",
      "bg-[#556B2F]",
      "bg-[#FFDAB9]",
      "bg-[#DB7093]",
      "bg-[#FFFF00]",
      "bg-[#FF00FF]",
      "bg-[#40E0D0]",
      "bg-[#EE82EE]",
      "bg-[#F0E68C]",
      "bg-[#FF7F50]",
      "bg-[#C0C0C0]",
      "bg-[#ADFF2F]",
      "bg-[#FF0000]",
      "bg-[#000000]",
      "bg-[#FFFFFF]",
      "bg-[#FFD700]",
      "bg-[#87CEEB]",
      "bg-[#5F9EA0]",
      "bg-[#D3D3D3]",
      "bg-[#FFFFE0]",
      "bg-[#90EE90]",
      "bg-[#FFA07A]",
      "bg-[#98FB98]",
      "bg-[#FF4500]",
      "bg-[#D2691E]",
      "bg-[#B22222]",
      "bg-[#7FFFD4]",
      "bg-[#FF69B4]",
      "bg-[#C0C0C0]",
      "bg-[#FF1493]",
      "bg-[#00008B]",
      "bg-[#BDB76B]",
      "bg-[#FFD700]",
      "bg-[#C0C0C0]",
      "bg-[#FFFF00]",
      "bg-[#F5FFFA]",
      "bg-[#FF7F50]",
      "bg-[#DC143C]",
      "bg-[#7CFC00]",
      "bg-[#DDA0DD]",
      "bg-[#C0C0C0]",
      "bg-[#FFFACD]",
      "bg-[#20B2AA]",
      "bg-[#F0FFFF]",
      "bg-[#B8860B]",
      "bg-[#FA8072]",
      "bg-[#FFFFE0]",
      "bg-[#006400]",
      "bg-[#9932CC]",
      "bg-[#FF6347]",
      "bg-[#663399]",
      "bg-[#48D1CC]",
      "bg-[#FFB6C1]",
      "bg-[#FFE4B5]",
      "bg-[#FF4500]",
      "bg-[#DA70D6]",
      "bg-[#FF00FF]",
      "bg-[#A9A9A9]",
      "bg-[#0000CD]",
      "bg-[#6B8E23]",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div>
      <h1 className="font-bold text-4xl mb-4">Login Requests</h1>

      {/* Display success/error message */}
      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <div className="">
        {/* Search Bar */}
        <div className="flex items-center space-x-10 mb-2">
          <div className="relative w-[77%]">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch className="w-4 h-4 ml-5" />
            </span>
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium"
            />
          </div>

          {/* Operation Type and Dropdown */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <p className="font-normal text-lg">Status:</p>
              <select className="border border-[#3B82F6] text-sm font-normal rounded-md bg-[#Fff] px-4 py-2">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Record Count and Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-black font-medium">
            {users.length > 0
              ? `Showing ${startRecord} - ${endRecord} of ${totalRecords} records`
              : "No records found"}
          </div>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr className="border-b text-[#6B7B90] font-light text-sm">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Requested At</th>
            <th>Status</th>
            <th className="py-2 pl-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => {
              const initials = generateInitials(user.name);
              const bgColor = getRandomBgColor();
              return (
                <tr key={user._id} className="border-b space-x-20">
                  <td className="py-3 px-4 flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-lg font-bold ${bgColor}`}
                    >
                      {initials}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">
                    {new Date(user.requestedAt).toLocaleString()}
                  </td>
                  <td className="">{user.status}</td>
                  <td className="py-0.5 relative">
                    <button
                      onClick={() =>
                        setShowPopup(showPopup === user._id ? null : user._id)
                      }
                      className="border border-black font-medium px-2 rounded-md mt-4 mb-5 ml-20"
                    >
                      {user.actions
                        ? user.actions.join(", ")
                        : "Request actions"}
                    </button>
                    {showPopup === user._id && (
                      <div className="absolute top-12 left-0 bg-white border rounded-md space-y-4 px-4 py-4 z-10">
                        <button
                          onClick={() => handlePopupAction("accept", user)}
                          className="block px-12 py-1 font-semibold hover:bg-gray-100 text-green-500 border border-green-500 rounded-md"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handlePopupAction("reject", user)}
                          className="block px-12 py-1 font-semibold hover:bg-gray-100 text-red-500 border border-red-500 rounded-md"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handlePopupAction("delete", user)}
                          className="block px-12 py-1 font-semibold hover:bg-gray-100 text-red-500 border border-red-500 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No user requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}