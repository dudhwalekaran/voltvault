"use client";

import { useState, useEffect, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function EditTurbine({ id }) {
  const [location, setLocation] = useState("");
  const [turbineType, setTurbineType] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await fetch(`/api/turbine/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setLocation(data.turbine.location);
          setTurbineType(data.turbine.turbineType);
          setDeviceName(data.turbine.deviceName);
          setExistingImage(data.turbine.imageUrl);
        } else {
          setError(data.message || "Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();
  }, [id]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let imageUrl = existingImage;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please log in.");
        setIsSubmitting(false);
        return;
      }

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "pslab_images");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload",
          {
            method: "POST",
            body: formData,
          }
        ).then((res) => res.json());

        if (!uploadResponse.secure_url) {
          throw new Error("Image upload failed");
        }

        imageUrl = uploadResponse.secure_url;
      }

      const response = await fetch(`/api/turbine/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify({ location, turbineType, deviceName, imageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update turbine");
      }

      alert("Turbine updated successfully!");
      router.push("/turbine-governor");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/turbine-governor");
  };

  if (error) return <p className="text-red-500 m-4">{error}</p>;

  return (
    <div className="m-4 font-bold text-3xl">
      <h1 className="mb-6">Edit Turbine</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="block text-sm font-normal mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
          <label className="block text-sm font-normal mb-2 mt-4">Device Name</label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Device Name"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-normal mb-2">Turbine Type</label>
          <input
            type="text"
            value={turbineType}
            onChange={(e) => setTurbineType(e.target.value)}
            placeholder="turbine type"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />

          <label className="block text-sm font-normal mb-2 mt-4">Image</label>
          <div className="relative w-full h-[200px] bg-[rgb(245,245,245)] border-2 border-dashed border-[#9CA3AF] rounded-lg flex flex-col justify-center items-center">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <FaCloudUploadAlt className="text-4xl text-[#AFAFAF]" />
            <span className="text-sm font-normal text-[#757575] mt-2">
              Upload Picture Here from your device
            </span>
            <span className="text-xs font-normal text-[#757575] mt-1">
              .jpg or .jpeg or .png
            </span>

            {existingImage && !imagePreview && (
              <img
                src={existingImage}
                alt="Existing"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            )}

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            )}

            <button
              type="button"
              onClick={handleButtonClick}
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg"
            >
              Select from Computer
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-[#1E40AF] text-white w-48 py-2 px-6 font-normal text-base rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-[#EF4444] text-white w-48 py-2 px-6 font-normal text-base rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}