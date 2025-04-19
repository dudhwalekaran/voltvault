"use client";

import Link from "next/link";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Attempting login with email:", email, "password:", password);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT in localStorage
        localStorage.setItem("authToken", data.token);

        // Decode the token to get the role and user details
        const decodedToken = jwtDecode(data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: decodedToken.email,
            name: decodedToken.name,
            status: decodedToken.status, // Store the role (adminStatus)
          })
        );

        alert(`Login successful! Welcome, ${decodedToken.name}`);
        window.location.href = "/bus"; // Redirect to bus page
      } else {
        setError(data.message);
        alert(data.message); // Show error to user
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      alert("An error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      {/* Landing Section with background image */}
      <div className="landing relative bg-cover bg-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#434867CC] opacity-85"></div>

        {/* Navbar - fixed on top */}
        <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-20">
          <div className="logo">
            <img src="/logo (1).png" alt="Logo" className="h-16" />
          </div>
          <nav className="flex space-x-8">
            <h6 className="text-white text-base font-bold">
              <a
                href="https://drive.google.com/file/d/1pEiNQ9-XFeCBnL-c7BAYGX6i3oIgrqMJ/view"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:underline"
              >
                User's Manual
              </a>
            </h6>
            <h6 className="text-white text-base font-bold">
              <a
                href="https://voltvault-docs.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:underline"
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
        <div className="login-overlay absolute right-10 top-32 w-[26%] h-[65%] bg-[#646B77] bg-opacity-90 rounded-lg p-6 shadow-xl z-10">
          <div className="login-form text-white space-y-5">
            <h3 className="text-lg font-semibold">Login to your Account</h3>
            <p className="text-sm">
              Enter your Email and Password below to login to your account
            </p>
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="email" className="block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@xyz.com"
                  className="w-[280px] p-2 rounded-md bg-white text-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-[280px] p-2 px-2.5 rounded-md bg-white text-black"
                  required
                />
              </div>

              <p className="forgot text-sm text-blue-400 cursor-pointer mt-2">
                <Link href="forgot-pass">Forgot Password</Link>
              </p>

              <div className="btn-container flex gap-3 mt-4">
                <button
                  type="submit"
                  className="login-btn w-1/2 h-11 bg-[#2C49A4] hover:bg-blue-600 p-3 rounded-md text-white"
                >
                  Login
                </button>
                <button className="request w-1/2 h-11 bg-yellow-500 hover:bg-yellow-600 p-3 rounded-md text-white">
                  <Link href="request-login">Request Login</Link>
                </button>
              </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}