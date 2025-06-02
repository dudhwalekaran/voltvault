"use client";

import { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const recordsPerPage = 20;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.status === "admin");
      } catch (err) {
        console.error("Token decode failed:", err);
        setError("Invalid token. Please log in again.");
      }
    } else {
      setError("No token found. Please log in.");
    }
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("/api/loginuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const usersData = data.map((user) => ({ ...user, password: undefined }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => (user.status || "").toLowerCase() === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, users]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleMakeAdmin = async (user) => {
    if (!isAdmin) {
      setError("Only admins can perform this action.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "makeAdmin" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to make user an admin");
      }

      setUsers(users.map((u) => (u._id === user._id ? { ...u, adminStatus: "admin" } : u)));
      setShowPopup(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (user) => {
    if (!isAdmin) {
      setError("Only admins can perform this action.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "removeAdmin" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove admin status");
      }

      setUsers(users.map((u) => (u._id === user._id ? { ...u, adminStatus: "user" } : u)));
      setShowPopup(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!isAdmin) {
      setError("Only admins can perform this action.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => u._id !== user._id));
      setShowPopup(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupAction = (action, user) => {
    if (action === "makeAdmin") {
      handleMakeAdmin(user);
    } else if (action === "accept") {
      handleRemoveAdmin(user);
    } else if (action === "delete") {
      handleDeleteUser(user);
    }
  };

  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function generateInitials(name) {
    if (typeof name !== "string" || name.trim() === "") return "";
    const nameParts = name.trim().split(" ").filter(Boolean);
    if (nameParts.length === 0) return "";
    return nameParts.map((part) => part.charAt(0).toUpperCase()).slice(0, 2).join("");
  }

  function getRandomBgColor() {
    const colors = [
      "bg-blue-600", "bg-green-500", "bg-red-500", "bg-purple-600", "bg-yellow-500",
      "bg-pink-500", "bg-teal-500", "bg-orange-500", "bg-indigo-500", "bg-gray-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sticky top-0 z-10 bg-white shadow-md p-4 rounded-lg">
        <h1 className="font-bold text-3xl mb-4">Registered Users</h1>
        <div className="flex items-center space-x-6 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-gray-100 border border-gray-300 rounded-full placeholder:text-sm font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="font-medium text-sm">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 text-sm font-medium bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="disable">Disable</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-lg">Loading users...</p>
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto hide-scrollbar mt-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Created At</th>
                <th className="py-3 px-6">Last Login</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Admin Status</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers
                  .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                  .map((user) => {
                    const initials = generateInitials(user.name);
                    const bgColor = getRandomBgColor();
                    return (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-bold ${bgColor}`}
                          >
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "No login recorded"}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                              user.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                              user.adminStatus === "admin" ? "bg-blue-600" : "bg-gray-600"
                            }`}
                          >
                            {user.adminStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 relative">
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() =>
                                  setShowPopup(showPopup === user._id ? null : user._id)
                                }
                                className="border border-gray-300 text-gray-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-gray-100"
                                disabled={loading}
                              >
                                Account Actions
                              </button>
                              {showPopup === user._id && (
                                <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                                  {user.adminStatus === "admin" ? (
                                    <button
                                      onClick={() => handlePopupAction("accept", user)}
                                      className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                                      disabled={loading}
                                    >
                                      Remove Admin Status
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePopupAction("makeAdmin", user)}
                                      className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md"
                                      disabled={loading}
                                    >
                                      Make Admin
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handlePopupAction("delete", user)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                    disabled={loading}
                                  >
                                    Delete User
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">Admin Only</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    <div className="text-gray-500 text-lg">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                      </svg>
                      No users found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <div>
            Showing {startRecord} to {endRecord} of {totalRecords} records
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border border-gray-300 rounded-lg ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
