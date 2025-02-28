'use client';

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
  const { token } = React.use(params); // This should now properly extract the token
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }), // Use unwrapped token here
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000); // Redirect after 3s
      } else {
        const result = await response.json();
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      {success ? (
        <p className="text-green-600">Password reset successful! Redirecting to login...</p>
      ) : (
        <form className="w-1/3 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">New Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
