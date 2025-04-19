'use client';

import { useState, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BusCreate() {
  const [location, setLocation] = useState('');
  const [turbineType, setTurbineType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleButtonClick = () => fileInputRef.current.click();
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleTurbineChange = (e) => setTurbineType(e.target.value);
  const handleDeviceChange = (e) => setDeviceName(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location || !turbineType || !deviceName || !image) {
      setError("Please fill all the fields (Location, Turbine Type, Device Name, and Image).");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "pslab_images");

      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (!uploadResponse.secure_url) throw new Error("Image upload failed");

      const imageUrl = uploadResponse.secure_url;
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("/api/turbine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location, turbineType, deviceName, imageUrl }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.success) throw new Error(data.error || "Failed to save Turbine Governor");

      alert(data.message || "Turbine Governor created successfully!");
      setLocation("");
      setTurbineType("");
      setDeviceName("");
      setImage(null);
      setImagePreview(null);
      setUploadData(uploadResponse);
      router.push("/turbine-governor");
    } catch (error) {
      console.error("Error:", error);
      setError("Submission failed: " + (error.message || "An error occurred, please try again"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <div className="mb-6">Create Turbine</div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Location"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Turbine Type</label>
          <input
            type="text"
            value={turbineType}
            onChange={handleTurbineChange}
            placeholder="turbine type"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Device Name</label>
          <input
            type="text"
            value={deviceName}
            onChange={handleDeviceChange}
            placeholder="Device Name"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>
        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg flex justify-center items-center cursor-pointer space-y-6">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <FaCloudUploadAlt className="text-6xl text-[#AFAFAF] -translate-y-14" />
            <span className="flex flex-col absolute bottom-16 text-sm font-normal text-[#757575] -translate-y-14">
              Upload Picture Here from your device <br />
              <span className="text-xs font-semibold">.jpg or .jpeg or .png</span>
            </span>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            )}
            <button
              onClick={handleButtonClick}
              className="absolute bottom-5 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg"
            >
              Select from Computer
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-800 w-48 text-white py-2 px-6 font-normal text-base rounded-lg hover:bg-blue-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <Link href="/turbine-governor">
          <button className="bg-red-600 w-48 text-white py-2 px-6 font-normal text-base rounded-lg hover:bg-red-600">
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
}