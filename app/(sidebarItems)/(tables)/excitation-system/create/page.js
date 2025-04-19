"use client";

import { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Link from "next/link";

export default function BusCreate() {
  const [location, setLocation] = useState("");
  const [avr, setAvr] = useState("");
  const [generator, setGenerator] = useState("");
  const [avrImage, setAvrImage] = useState(null);
  const [pssImage, setPssImage] = useState(null);
  const [extraImage1, setExtraImage1] = useState(null); // New state for Extra Image 1
  const [extraImage2, setExtraImage2] = useState(null); // New state for Extra Image 2
  const [avrImagePreview, setAvrImagePreview] = useState(null);
  const [pssImagePreview, setPssImagePreview] = useState(null);
  const [extraImage1Preview, setExtraImage1Preview] = useState(null); // Preview for Extra Image 1
  const [extraImage2Preview, setExtraImage2Preview] = useState(null); // Preview for Extra Image 2
  const [uploadData, setUploadData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avrFileInputRef = useRef(null);
  const pssFileInputRef = useRef(null);
  const extraImage1Ref = useRef(null); // Ref for Extra Image 1
  const extraImage2Ref = useRef(null); // Ref for Extra Image 2

  const handleAvrButtonClick = () => {
    avrFileInputRef.current.click();
  };

  const handlePssButtonClick = () => {
    pssFileInputRef.current.click();
  };

  const handleExtraImage1ButtonClick = () => {
    extraImage1Ref.current.click();
  };

  const handleExtraImage2ButtonClick = () => {
    extraImage2Ref.current.click();
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleAvrChange = (e) => {
    setAvr(e.target.value);
  };

  const handleGeneratorChange = (e) => {
    setGenerator(e.target.value);
  };

  const handleAvrImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvrImage(file);
      setAvrImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePssImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPssImage(file);
      setPssImagePreview(URL.createObjectURL(file));
    }
  };

  const handleExtraImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExtraImage1(file);
      setExtraImage1Preview(URL.createObjectURL(file));
    }
  };

  const handleExtraImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExtraImage2(file);
      setExtraImage2Preview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location || !avrImage) {
      alert("Please fill in the location and select an AVR image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload AVR image
      const avrFormData = new FormData();
      avrFormData.append("file", avrImage);
      avrFormData.append("upload_preset", "pslab_images");

      const avrUploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload",
        {
          method: "POST",
          body: avrFormData,
        }
      ).then((res) => res.json());

      if (!avrUploadResponse.secure_url) {
        throw new Error("AVR image upload failed");
      }
      const avrImageUrl = avrUploadResponse.secure_url;

      // Upload PSS image if it exists
      let pssImageUrl = null;
      if (pssImage) {
        const pssFormData = new FormData();
        pssFormData.append("file", pssImage);
        pssFormData.append("upload_preset", "pslab_images");

        const pssUploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload",
          {
            method: "POST",
            body: pssFormData,
          }
        ).then((res) => res.json());

        if (!pssUploadResponse.secure_url) {
          throw new Error("PSS image upload failed");
        }
        pssImageUrl = pssUploadResponse.secure_url;
      }

      // Upload Extra Image 1 if it exists
      let extraImage1Url = null;
      if (extraImage1) {
        const extra1FormData = new FormData();
        extra1FormData.append("file", extraImage1);
        extra1FormData.append("upload_preset", "pslab_images");

        const extra1UploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload",
          {
            method: "POST",
            body: extra1FormData,
          }
        ).then((res) => res.json());

        if (!extra1UploadResponse.secure_url) {
          throw new Error("Extra Image 1 upload failed");
        }
        extraImage1Url = extra1UploadResponse.secure_url;
      }

      // Upload Extra Image 2 if it exists
      let extraImage2Url = null;
      if (extraImage2) {
        const extra2FormData = new FormData();
        extra2FormData.append("file", extraImage2);
        extra2FormData.append("upload_preset", "pslab_images");

        const extra2UploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload",
          {
            method: "POST",
            body: extra2FormData,
          }
        ).then((res) => res.json());

        if (!extra2UploadResponse.secure_url) {
          throw new Error("Extra Image 2 upload failed");
        }
        extraImage2Url = extra2UploadResponse.secure_url;
      }

      // Send data to backend with JWT token
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("/api/excitation-system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          avr,
          generator,
          avrImageUrl,
          pssImageUrl,
          extraImage1Url,
          extraImage2Url,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        alert(data.message); // Role-specific message from backend
        setLocation("");
        setAvr("");
        setGenerator("");
        setAvrImage(null);
        setPssImage(null);
        setExtraImage1(null);
        setExtraImage2(null);
        setAvrImagePreview(null);
        setPssImagePreview(null);
        setExtraImage1Preview(null);
        setExtraImage2Preview(null);
        setUploadData(avrUploadResponse);
      } else {
        throw new Error(data.error || "Failed to create Excitation System");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <div className="mb-6">Create Excitation System</div>

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
          <label className="block text-sm font-medium mb-2">
            Automatic Voltage Regulator
          </label>
          <input
            type="text"
            value={avr}
            onChange={handleAvrChange}
            placeholder="Avr"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Generator Device Name
          </label>
          <input
            type="text"
            value={generator}
            onChange={handleGeneratorChange}
            placeholder="Generator device name"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">Avr Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleAvrImageChange}
              ref={avrFileInputRef}
            />
            {!avrImagePreview && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">
                  Upload Picture Here from your device <br />
                  <span className="text-xs font-semibold">
                    .jpg or .jpeg or .png
                  </span>
                </span>
              </div>
            )}
            {avrImagePreview && (
              <img
                src={avrImagePreview}
                alt="AVR Image Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <button
              onClick={handleAvrButtonClick}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10"
            >
              Select from Computer
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">
            Power system stabilizer(Pss) Image
          </label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handlePssImageChange}
              ref={pssFileInputRef}
            />
            {!pssImagePreview && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">
                  Upload Picture Here from your device <br />
                  <span className="text-xs font-semibold">
                    .jpg or .jpeg or .png
                  </span>
                </span>
              </div>
            )}
            {pssImagePreview && (
              <img
                src={pssImagePreview}
                alt="PSS Image Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <button
              onClick={handlePssButtonClick}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10"
            >
              Select from Computer
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">
            Under Excitation Limiter(UEL) Image
          </label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleExtraImage1Change}
              ref={extraImage1Ref}
            />
            {!extraImage1Preview && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">
                  Upload Picture Here from your device <br />
                  <span className="text-xs font-semibold">
                    .jpg or .jpeg or .png
                  </span>
                </span>
              </div>
            )}
            {extraImage1Preview && (
              <img
                src={extraImage1Preview}
                alt="Extra Image 1 Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <button
              onClick={handleExtraImage1ButtonClick}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10"
            >
              Select from Computer
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">
            Over Excitation Limiter(OEL) Image
          </label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleExtraImage2Change}
              ref={extraImage2Ref}
            />
            {!extraImage2Preview && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">
                  Upload Picture Here from your device <br />
                  <span className="text-xs font-semibold">
                    .jpg or .jpeg or .png
                  </span>
                </span>
              </div>
            )}
            {extraImage2Preview && (
              <img
                src={extraImage2Preview}
                alt="Extra Image 2 Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <button
              onClick={handleExtraImage2ButtonClick}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10"
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
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <Link href="/excitation-system">
          <button className="bg-red-600 w-48 text-white py-2 px-6 font-normal text-base rounded-lg hover:bg-red-600">
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
}
