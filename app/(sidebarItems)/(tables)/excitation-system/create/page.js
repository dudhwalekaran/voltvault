'use client';

import { useState, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function BusCreate() {
  const [location, setLocation] = useState('');
  const [avrType, setAvrType] = useState(null);
  const [generatorDeviceName, setGeneratorDeviceName] = useState('');
  const [pssImageUrl, setPssImageUrl] = useState(null);
  const [avrImageUrl, setAvrImageUrl] = useState(null);
  const [oelImageUrl, setOelImageUrl] = useState(null);
  const [uelImageUrl, setUelImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadData, setUploadData] = useState(null); // Holds the upload response data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input when button is clicked
  };

  // Handle description input
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Handle description input
  const handleAvrTypeChange = (e) => {
    setAvrType(e.target.value);
  };

  // Handle description input
  const handleGeneratorDeviceNameChange = (e) => {
    setGeneratorDeviceName(e.target.value);
  };

  const handlePssImageUrlChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleAvrImageUrlChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleOelImageUrlChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleUelImageUrlChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location || !avrType || generatorDeviceName || pssImageUrl) {
      alert('Please fill in the description and select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('file', image); // Append image
      formData.append('upload_preset', 'pslab_images'); // Set the upload preset

      // Upload image to Cloudinary
      const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload', {
        method: 'POST',
        body: formData,
      }).then((res) => res.json());

      // Check for success
      if (!uploadResponse.secure_url) {
        throw new Error('Image upload failed');
      }

      // Image URL after uploading to Cloudinary
      const pssImageUrl = uploadResponse.secure_url;
      const avrImageUrl = uploadResponse.secure_url;
      const oelImageUrl = uploadResponse.secure_url;
      const uelImageUrl = uploadResponse.secure_url;

      // Send data to your backend (MongoDB) API
      const response = await fetch('/api/excitation-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, pssImageUrl, avrImageUrl, oelImageUrl, uelImageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to save diagram');
      }

      alert('Diagram created successfully!');
      setLocation('');
      setAvrType('');
      setGeneratorDeviceName('');
      setPssImageUrl(null);
      setAvrImageUrl(null);
      setOelImageUrl(null);
      setUelImageUrl(null);
      setImagePreview(null);
      setUploadData(uploadResponse); // Save upload data (e.g. Cloudinary response)

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <div className="mb-6">Create Excitation System</div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">location</label>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Description"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Avr Type</label>
          <input
            type="text"
            value={avrType}
            onChange={handleAvrTypeChange}
            placeholder="Description"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Generator Device Name</label>
          <input
            type="text"
            value={generatorDeviceName}
            onChange={handleGeneratorDeviceNameChange}
            placeholder="Description"
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
              <span className="text-xs font-semibold">
                .jpg or .jpeg or .png
              </span>
            </span>

            {/* Image Preview inside the Box */}
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
        <Link href="/single-line-diagram">
          <button className="bg-red-600 w-48 text-white py-2 px-6 font-normal text-base rounded-lg hover:bg-red-600">
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
}
