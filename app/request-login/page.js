"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function RequestLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      console.log("Submitting data:", { name, email, pass }); // Debug log
      const response = await axios.post("/api/requestLogin", {
        name,
        email,
        password: pass, // Correct field mapping
      });
  
      if (response.status === 201) {
        alert("Request submitted successfully!");
        setName("");
        setEmail("");
        setPass("");
      } else {
        alert("Unexpected response. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err); // Log error details
      alert("Failed to submit the request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <>
      {/* Landing Section with background image */}
      <div className="landing relative bg-cover bg-center bg-no-repeat h-screen">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#434867CC] bg-opacity-50"></div>

        {/* Navbar - fixed on top */}
        <div className="nav-bar flex items-center justify-between p-4 z-1 absolute top-0 left-0 right-0">
          <div className="logo">
            <img src="/logo (1).png" alt="Logo" className="h-16" />
          </div>
          <nav className="flex space-x-8">
            <h6 className="text-white text-base font-bold cursor-pointer">
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
        <div className="login-overlay absolute right-10 top-32 w-[26%] h-[70%] bg-[#646B77] bg-opacity-90 rounded-lg p-6 shadow-xl z-10">
          <h3 className="text-lg font-semibold text-white mb-2">
            Login to your Account
          </h3>
          <form
            onSubmit={handleSubmit}
            className="login-form text-white space-y-2"
          >
            <p className="text-sm">
              Enter your Email and Password below to login to your account
            </p>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@xyz.com"
              className="w-[280px] p-2 rounded-md bg-white text-black"
            />
            <label htmlFor="name" className="block">
              Name
            </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Name"
              className="w-[280px] p-2 px-2.5 rounded-md bg-white text-black"
            />
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPass(e.target.value)}
              required
              placeholder="Password"
              className="w-[280px] p-2 px-2.5 rounded-md bg-white text-black"
            />

            <div className="btn-container flex gap-3 pt-4">
              <button
                type="submit"
                className="login-btn w-1/2 h-11 bg-[#2C49A4] hover:bg-blue-600 p-3 rounded-md text-white"
              >
                Submit
              </button>
              <button className="request w-1/2 h-11 bg-yellow-500 hover:bg-yellow-600 p-3 rounded-md text-white">
                <Link href="/landing-page">Go Back</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
