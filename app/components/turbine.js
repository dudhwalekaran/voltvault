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
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/turbine/${id}`);
        const data = await response.json();
        if (data.success) {
          setLocation(data.turbine.location);
          setTurbineType(data.turbine.turbineType);
          setDeviceName(data.turbine.deviceName);
          setExistingImage(data.turbine.imageUrl);
        } else {
          alert("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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

    let imageUrl = existingImage;

    try {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, turbineType, deviceName, imageUrl }),
      });      

      if (!response.ok) throw new Error("Failed to update turbine");

      alert("Turbine updated successfully!");
      router.push("/turbine-governor");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <div className="mb-6">Edit Turbine</div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Turbine Type</label>
          <input
            type="text"
            value={turbineType}
            onChange={(e) => setTurbineType(e.target.value)}
            placeholder="Turbine Type"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Device Name</label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Device Name"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center items-start mb-6">
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
            Upload New Image
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
            onClick={handleButtonClick}
            className="absolute bottom-5 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg"
          >
            Select New Image
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-800 w-48 text-white py-2 px-6 font-normal text-base rounded-lg hover:bg-blue-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
