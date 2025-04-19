"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("/api/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {/* Landing Section with background image */}
      <div className="landing relative bg-cover bg-center bg-no-repeat h-screen">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#434867CC] bg-opacity-85"></div>

        {/* Navbar - fixed on top */}
        <div className="nav-bar flex items-center justify-between p-4 z-1 absolute top-0 left-0 right-0 z-20">
          <div className="logo">
            <img src="/logo (1).png" alt="Logo" className="h-16" />
          </div>
          <nav className="flex space-x-8">
            <h6 className="text-white text-base font-bold cursor-pointer hover:underline">
              <a
                href="https://drive.google.com/file/d/1pEiNQ9-XFeCBnL-c7BAYGX6i3oIgrqMJ/view"
                target="_blank"
                rel="noopener noreferrer relative z-10"
              >
                User's Manual
              </a>
            </h6>
            <h6 className="text-white text-base font-bold hover:underline cursor-pointer">
              <a
                href="https://voltvault-docs.vercel.app/"
                target="_blank"
                rel="noopener noreferrer relative z-10"
              >
                Developer's Documentation
              </a>
            </h6>
          </nav>
        </div>

        {/* Main Content Section */}
        <div className="container flex flex-col items-start justify-center h-screen font-bold text-white text-6xl px-28 py-16 z-10 relative">
          <h1>
            Welcome to <span className="text-yellow-500">VoltVault!</span>
          </h1>
          <p className="mt-4 text-lg pl-12">
            Database for efficient power system data management!
          </p>
        </div>

        {/* Login Overlay */}
        <div className="login-overlay absolute right-10 top-40 w-[26%] h-[45%] bg-[#646B77] bg-opacity-85 rounded-lg p-6 shadow-xl z-10">
          <div className="login-form text-white space-y-2">
            <h3 className="text-lg font-semibold">Login to your Account</h3>
            <p className="text-sm">
              Enter your Email and Password below to login to your account
            </p>

            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-[280px] p-2 rounded-md bg-white text-black"
            />

            <div className="btn-container flex gap-3 pt-4">
              <button
                onClick={handleForgotPassword}
                className="login-btn w-1/2 h-11 bg-[#2C49A4] hover:bg-blue-600 p-3 rounded-md text-white"
              >
                Submit
              </button>

              <button className="request w-1/2 h-11 bg-yellow-500 hover:bg-yellow-600 p-3 rounded-md text-white">
                <Link href="/">Back to login</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
