"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaUser, FaHistory, FaTable } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io"; // Submenu arrow icon

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(""); // Track open submenu

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? "" : menu));
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
      <div
        className="flex items-center text-xl space-x-2 p-2 cursor-pointer hover:bg-gray-300 rounded-lg mb-2 mt-3"
        // onClick={handleUser} // No routing, but you can add a click handler for actions
      >
        <FaUser />
        <span>
          <Link href="/users">User</Link>
        </span>
      </div>

      {/* History Menu */}
      <div
        className="flex items-center text-xl space-x-2 p-2 cursor-pointer hover:bg-gray-300 rounded-lg mb-2"
        // onClick={handleHistory} // No routing, but you can add a click handler for actions
      >
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
          <div className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg">
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
    </div>
  );
};

export default Sidebar;
