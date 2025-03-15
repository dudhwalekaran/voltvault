"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ResetPassword({ params }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Unwrap the params using React.use() (for Next.js 15)
  const { token } = React.use(params); // Extract token from params

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000); // Redirect to login after 3s
      } else {
        const result = await response.json();
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
      {/* Main Container with Background Image */}
      <div className="landing relative bg-cover bg-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[#434867CC] opacity-80"></div>

        {/* Navbar - Fixed on Top */}
        <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0">
          <div className="logo">
            <img src="/logo (1).png" alt="Logo" className="h-16" />
          </div>
          <nav className="flex space-x-8">
            <h6 className="text-white text-base font-bold">
              <Link
                href="https://drive.google.com/file/d/1pEiNQ9-XFeCBnL-c7BAYGX6i3oIgrqMJ/view"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:underline"
              >
                User's Manual
              </Link>
            </h6>
            <h6 className="text-white text-base font-bold">
              <Link
                href="https://voltvault-docs.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Developer's Documentation
              </Link>
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

        {/* Reset Password Overlay */}
        <div className="login-overlay absolute right-10 top-32 w-[26%] h-[65%] bg-[#646B77] bg-opacity-90 rounded-lg p-6 shadow-xl z-10">
          <div className="login-form text-white space-y-5">
            <h3 className="text-lg font-semibold">Reset Your Password</h3>
            {success ? (
              <p className="text-green-400">
                Password reset successful! Redirecting to login...
              </p>
            ) : (
              <>
                <p className="text-sm">
                  Enter your new password below to reset your account
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block">
                      New Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="New password"
                      className="w-[280px] p-2 rounded-md bg-white text-black"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      className="w-[280px] p-2 rounded-md bg-white text-black"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                  )}

                  <div className="btn-container flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="login-btn w-full h-11 mt-4 font-normal bg-[#2C49A4] hover:bg-blue-600 p-3 rounded-md text-white"
                    >
                      Reset Password
                    </button>
                    <button
                      type="submit"
                      className="login-btn w-full h-11 mt-4 font-normal bg-[#2C49A4] hover:bg-blue-600 p-3 rounded-md text-white"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
