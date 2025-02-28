"use client";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function User() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        console.log("Fetching users...");
        const response = await fetch("/api/loginuser"); // Corrected API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setUsers(data.map((user) => ({ ...user, password: undefined }))); // Exclude password
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    }

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
      return ""; // Return an empty string if name is not a valid string or is empty
    }

    const nameParts = name.trim().split(" ").filter(Boolean); // Split by spaces and remove empty entries
    if (nameParts.length === 0) {
      return ""; // If nameParts is empty, return an empty string
    }

    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase()) // Get the first letter of each part
      .slice(0, 2) // Take only the first two initials
      .join(""); // Join them into a string

    return initials;
  }

  // Function to generate a random background color
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
    <div className="font-bold text-4xl">
      Users registered
      <div className="flex items-center space-x-10 mb-2 mt-2">
        {/* Search Bar */}
        <div className="relative w-[77%]">
          <span className="absolute left-2 top-1/3 transform text-gray-500">
            <FaSearch className="w-5 h-5 ml-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[45px] pl-16 pr-4 bg-[#F2F3F5] border border-gray-300 rounded-3xl placeholder:text-base font-medium text-sm leading-[45px]"
          />
        </div>

        {/* Operation Type and Dropdown */}
        <div className="flex space-x-6">
          {/* First p and dropdown */}
          <div className="flex items-center space-x-2">
            <p className="font-normal text-lg">Status:</p>
            <select className="border border-gray-300 text-sm font-normal bg-[#Fff] px-4 py-2">
              <option value="option1">All</option>
              <option value="option2">Active</option>
              <option value="option3">Disable</option>
            </select>
          </div>
        </div>
      </div>
      <table border="1" style={{ width: "130%", textAlign: "left" }} className="min-w-full min-h-full">
        <thead>
          <tr className="border-b text-[#6B7B90] font-light text-sm">
            <th className="py-2 px-8">Name</th>
            <th className="py-2 px-10">Email</th>
            <th className="py-2 px-8">Created At</th>
            <th className="py-2 px-12">Lost Login</th>
            <th className="px-2">Status</th>
            <th className="pl-16">Admin Status</th>
            <th className="py-2 pl-8">Actions</th>
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
                    <span className="text-sm font-normal">{user.name}</span>
                  </td>
                  <td className="py-2 text-sm font-normal">{user.email}</td>
                  <td className="py-2 text-sm font-normal">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 border-b text-sm font-normal">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString() // Format the date/time
                      : "No login recorded"}
                  </td>
                  <td className="text-sm font-normal">
                    <div className="bg-green-600 px-2 text-white rounded-xl flex items-center justify-center">
                      {user.status}
                    </div>
                  </td>
                  <td className="text-sm font-normal pl-16 pr-16">
                    <div
                      className={`${
                        user.adminStatus === "admin"
                          ? "bg-[#2563EB]"
                          : "bg-[#4B5563]"
                      } text-white rounded-xl flex items-center justify-center`}
                    >
                      {user.adminStatus}
                    </div>
                  </td>

                  <td className="py-0.5 relative">
                    <button
                      onClick={() =>
                        setShowPopup(showPopup === user._id ? null : user._id)
                      }
                      className="border border-black font-normal text-base px-2 rounded-md mt-4 mb-5 ml-2"
                    >
                      {user.actions
                        ? user.actions.join(", ")
                        : "Account actions"}
                    </button>
                    {showPopup === user._id && (
                      <div className="absolute top-12 left-0 bg-white border text-base rounded-md space-y-4 px-2 py-4 z-10">
                        <button
                          onClick={() => handlePopupAction("accept", user)}
                          className="block px-2 py-2 font-normal text-sm hover:bg-gray-100 text-blue-500 border border-blue-500 rounded-md"
                        >
                          Remove user as admin
                        </button>
                        <button
                          onClick={() => handlePopupAction("reject", user)}
                          className="block px-10 py-2 font-normal text-sm hover:bg-gray-100 text-red-500 border border-red-500 rounded-md"
                        >
                          Disable User
                        </button>
                        <button
                          onClick={() => handlePopupAction("delete", user)}
                          className="block py-2 font-normal text-sm hover:bg-gray-100 text-red-500 border border-red-500 rounded-md"
                        >
                          remove user permanently
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-lg py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-6 text-lg">
        <div>
          Showing {startRecord} to {endRecord} of {totalRecords} records
        </div>
        <div>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-2 py-1 ${
                currentPage === index + 1 ? "bg-gray-200" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
