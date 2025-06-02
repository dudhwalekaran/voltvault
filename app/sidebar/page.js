"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaUser, FaHistory, FaTable } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Icons for Profile and Sign out

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(""); // Track open submenu
  const [user, setUser] = useState(null); // Store logged-in user data
  const [showProfileCard, setShowProfileCard] = useState(false); // Toggle profile card
  const router = useRouter();

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? "" : menu));
  };

  // Fetch logged-in user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  // Generate initials from the user's name
  const generateInitials = (name) => {
    if (typeof name !== "string" || name.trim() === "") return "";
    const nameParts = name.trim().split(" ").filter(Boolean);
    if (nameParts.length === 0) return "";
    return nameParts.map(part => part.charAt(0).toUpperCase()).slice(0, 2).join("");
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <div className="w-48 h-screen bg-gray-100 text-black flex flex-col p-4 overflow-y-auto border-r-2 border-gray-300 transition-all duration-300 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]">
      {/* Logo */}
      <div className="mb-6 text-center w-full">
        <img
          src="/logo (1).png"
          alt="Logo"
          className="h-10 w-full object-contain bg-black rounded-md"
        />
      </div>

      <hr className="border-t-2 border-gray-300 w-full" />

      {/* User Menu */}
      <div className="flex items-center text-xl space-x-2 p-2 cursor-pointer hover:bg-gray-300 rounded-lg mb-2 mt-3">
        <FaUser />
        <span>
          <Link href="/users">User</Link>
        </span>
      </div>

      {/* History Menu */}
      <div className="flex items-center text-xl space-x-2 p-2 cursor-pointer hover:bg-gray-300 rounded-lg mb-2">
        <FaHistory />
        <span>
          <Link href="/history">History</Link>
        </span>
      </div>

      {/* Request Menu with Submenu */}
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-300 rounded-lg mb-2"
        onClick={() => toggleSubmenu("request")}
      >
        <div className="flex text-xl items-center space-x-2">
          <GrDocumentUser />
          <span>Request</span>
        </div>
        <IoIosArrowDown
          className={`transition-transform duration-300 transform ${
            openMenu === "request" ? "rotate-180" : ""
          }`}
        />
      </div>
      {openMenu === "request" && (
        <div className="pl-5 border-l-2 border-gray-300 mb-2">
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/data-request">Data Request</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/login-request">Login Request</Link>
          </div>
        </div>
      )}

      {/* Tables Menu with Submenu */}
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-300 rounded-lg mb-2"
        onClick={() => toggleSubmenu("tables")}
      >
        <div className="flex items-center text-xl space-x-2">
          <FaTable />
          <span>Tables</span>
        </div>
        <IoIosArrowDown
          className={`transition-transform duration-300 transform ${
            openMenu === "tables" ? "rotate-180" : ""
          }`}
        />
      </div>
      {openMenu === "tables" && (
        <div className="pl-5 border-l-2 border-gray-300 mb-2">
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/bus">Bus</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/excitation-system">Excitation System</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/generator">Generators</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/load">Loads</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/series-capacitor">Series Capacitor</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/shunt-capacitor">Shunt Capacitor</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/shunt-reactor">Shunt Reactor</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/single-line-diagram">Single Line Diagram</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/transformer-three-winding">
              Transformers - Three Winding
            </Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/transformer-two-winding">
              Transformers - Two Winding
            </Link>
          </div>
          <div className "p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/transmission-line">Transmission Line</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/turbine-governor">Turbine Governor</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/ibr">IBR</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/lcc-hvdc-link">LCC-HVDC Link</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/series-fact">Series Facts</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/shunt-fact">Shunt Facts</Link>
          </div>
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
            <Link href="/vsc-hvdc-link">VSC-HVDC Link</Link>
          </div>
        </div>
      )}

      {/* Spacer to push profile section to the bottom */}
      <div className="flex-grow" />

      {/* Profile Section at the Bottom */}
      {user && (
        <div className="relative">
          <div
            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-300 rounded-lg"
            onClick={() => setShowProfileCard(!showProfileCard)}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white text-lg font-bold">
              {generateInitials(user.name)}
            </div>
            <span className="text-sm font-medium">{user.name}</span>
          </div>

          {/* Profile Card Dropdown */}
          {showProfileCard && (
            <div className="absolute bottom-full left-0 w-full bg-white border rounded-lg shadow-lg p-4 z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white text-xl font-bold">
                  {generateInitials(user.name)}
                </div>
                <div>
                  <p className="text-base font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href="/profile">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <FaUserCircle />
                    <span>Profile</span>
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
