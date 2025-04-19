"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransformerTwoWinding from "@/app/components/transformerTwoWinding";
import { use } from "react";

export default function EditTransformerTwoWinding({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [transformer, setTransformer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchTransformer = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch(`/api/transformer-two-winding/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched transformer data:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch transformer data");
        }

        setTransformer(data.data); // Use data.data explicitly
      } catch (error) {
        console.error("Error fetching transformer:", error.message);
        setError(error.message || "Failed to load transformer data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransformer();
  }, [id]);

  const handleSubmit = () => {
    router.push("/transformer-two-winding");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!transformer) return <p>No transformer data found.</p>;

  return <TransformerTwoWinding transformer={transformer} onSubmit={handleSubmit} />;
}