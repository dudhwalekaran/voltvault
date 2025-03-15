'use client';

import { useState, useEffect, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function EditExcitationSystem({ id }) {
  const [location, setLocation] = useState('');
  const [avr, setAvr] = useState('');
  const [generator, setGenerator] = useState('');
  const [avrImage, setAvrImage] = useState(null);
  const [pssImage, setPssImage] = useState(null);
  const [uelImage, setUelImage] = useState(null);
  const [oelImage, setOelImage] = useState(null);
  const [avrImagePreview, setAvrImagePreview] = useState(null);
  const [pssImagePreview, setPssImagePreview] = useState(null);
  const [uelImagePreview, setUelImagePreview] = useState(null);
  const [oelImagePreview, setOelImagePreview] = useState(null);
  const [existingAvrImage, setExistingAvrImage] = useState(null);
  const [existingPssImage, setExistingPssImage] = useState(null);
  const [existingUelImage, setExistingUelImage] = useState(null);
  const [existingOelImage, setExistingOelImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avrFileInputRef = useRef(null);
  const pssFileInputRef = useRef(null);
  const uelFileInputRef = useRef(null);
  const oelFileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the existing excitation system data
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/excitation-system/${id}`);
        const data = await response.json();
        if (data.success) {
          setLocation(data.excitation.location);
          setAvr(data.excitation.avrType);
          setGenerator(data.excitation.generatorDeviceName);
          setExistingAvrImage(data.excitation.avrImageUrl);
          setExistingPssImage(data.excitation.pssImageUrl);
          setExistingUelImage(data.excitation.uelImageUrl);
          setExistingOelImage(data.excitation.oelImageUrl);
        } else {
          alert('Failed to load excitation system data');
        }
      } catch (error) {
        console.error('Error fetching excitation system data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleAvrButtonClick = () => avrFileInputRef.current.click();
  const handlePssButtonClick = () => pssFileInputRef.current.click();
  const handleUelButtonClick = () => uelFileInputRef.current.click();
  const handleOelButtonClick = () => oelFileInputRef.current.click();

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

  const handleUelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUelImage(file);
      setUelImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOelImage(file);
      setOelImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let avrImageUrl = existingAvrImage;
    let pssImageUrl = existingPssImage;
    let uelImageUrl = existingUelImage;
    let oelImageUrl = existingOelImage;

    try {
      // Upload new images to Cloudinary if they exist
      const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'pslab_images');
        const response = await fetch('https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload', {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());
        if (!response.secure_url) throw new Error('Image upload failed');
        return response.secure_url;
      };

      if (avrImage) avrImageUrl = await uploadImage(avrImage);
      if (pssImage) pssImageUrl = await uploadImage(pssImage);
      if (uelImage) uelImageUrl = await uploadImage(uelImage);
      if (oelImage) oelImageUrl = await uploadImage(oelImage);

      // Update the excitation system in the database
      const response = await fetch(`/api/excitation-system/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          location, 
          avrType: avr, 
          generatorDeviceName: generator, 
          avrImageUrl, 
          pssImageUrl, 
          uelImageUrl, 
          oelImageUrl 
        }),
      });

      if (!response.ok) throw new Error('Failed to update excitation system');

      alert('Excitation system updated successfully!');
      router.push('/excitation-system');

    } catch (error) {
      console.error('Error updating excitation system:', error);
      alert('An error occurred, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <div className="mb-6">Edit Excitation System</div>

      <div className="grid grid-cols-2 gap-6 mb-6">
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
          <label className="block text-sm font-medium mb-2">Automatic Voltage Regulator</label>
          <input
            type="text"
            value={avr}
            onChange={(e) => setAvr(e.target.value)}
            placeholder="AVR"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Generator Device Name</label>
          <input
            type="text"
            value={generator}
            onChange={(e) => setGenerator(e.target.value)}
            placeholder="Generator Device Name"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        {/* AVR Image */}
        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">AVR Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleAvrImageChange} ref={avrFileInputRef} />
            {!avrImagePreview && !existingAvrImage && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">Upload New AVR Image</span>
              </div>
            )}
            {existingAvrImage && !avrImagePreview && (
              <img src={existingAvrImage} alt="Existing AVR" className="w-full h-full object-cover rounded-lg" />
            )}
            {avrImagePreview && <img src={avrImagePreview} alt="AVR Preview" className="w-full h-full object-cover rounded-lg" />}
            <button onClick={handleAvrButtonClick} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10">
              Select New Image
            </button>
          </div>
        </div>

        {/* PSS Image */}
        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">PSS Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handlePssImageChange} ref={pssFileInputRef} />
            {!pssImagePreview && !existingPssImage && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">Upload New PSS Image</span>
              </div>
            )}
            {existingPssImage && !pssImagePreview && (
              <img src={existingPssImage} alt="Existing PSS" className="w-full h-full object-cover rounded-lg" />
            )}
            {pssImagePreview && <img src={pssImagePreview} alt="PSS Preview" className="w-full h-full object-cover rounded-lg" />}
            <button onClick={handlePssButtonClick} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10">
              Select New Image
            </button>
          </div>
        </div>

        {/* UEL Image */}
        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">UEL Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleUelImageChange} ref={uelFileInputRef} />
            {!uelImagePreview && !existingUelImage && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">Upload New UEL Image</span>
              </div>
            )}
            {existingUelImage && !uelImagePreview && (
              <img src={existingUelImage} alt="Existing UEL" className="w-full h-full object-cover rounded-lg" />
            )}
            {uelImagePreview && <img src={uelImagePreview} alt="UEL Preview" className="w-full h-full object-cover rounded-lg" />}
            <button onClick={handleUelButtonClick} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10">
              Select New Image
            </button>
          </div>
        </div>

        {/* OEL Image */}
        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">OEL Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg overflow-hidden">
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleOelImageChange} ref={oelFileInputRef} />
            {!oelImagePreview && !existingOelImage && (
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6 pointer-events-none">
                <FaCloudUploadAlt className="text-6xl text-[#AFAFAF]" />
                <span className="flex flex-col text-sm font-normal text-[#757575] text-center">Upload New OEL Image</span>
              </div>
            )}
            {existingOelImage && !oelImagePreview && (
              <img src={existingOelImage} alt="Existing OEL" className="w-full h-full object-cover rounded-lg" />
            )}
            {oelImagePreview && <img src={oelImagePreview} alt="OEL Preview" className="w-full h-full object-cover rounded-lg" />}
            <button onClick={handleOelButtonClick} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg z-10">
              Select New Image
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button onClick={handleSubmit} className="bg-blue-800 w-48 text-white py-2 px-6 font-normal text-base rounded-lg hover:bg-blue-800" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
}