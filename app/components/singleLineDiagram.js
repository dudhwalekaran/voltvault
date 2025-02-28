'use client';

import { useState, useEffect, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function EditSingleLineDiagram({ id }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the existing data
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/single-line-diagram/${id}`);
        const data = await response.json();
        if (data.success) {
          setDescription(data.diagram.description);
          setExistingImage(data.diagram.imageUrl);
        } else {
          alert('Failed to load data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'pslab_images');

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dipmjt9ta/image/upload', {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());

        if (!uploadResponse.secure_url) {
          throw new Error('Image upload failed');
        }

        imageUrl = uploadResponse.secure_url; // Use new image URL
      }

      // Update the database with new description & image
      const response = await fetch(`/api/single-line-diagram/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, imageUrl }),
      });

      if (!response.ok) throw new Error('Failed to update diagram');

      alert('Diagram updated successfully!');
      router.push('/single-line-diagram');

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 font-bold text-3xl">
      <div className="mb-6">Edit Single Line Diagram</div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full h-[40px] pl-3 pr-4 bg-[#Fff] border border-gray-300 rounded-md placeholder:font-normal text-sm placeholder-[#000000]"
          />
        </div>

        <div className="flex flex-col justify-center items-start">
          <label className="block text-sm font-medium mb-2">Image</label>
          <div className="relative w-full h-[300px] bg-[#F5F5F5] border-2 border-dashed border-[#9CA3AF] rounded-lg flex justify-center items-center cursor-pointer space-y-6">
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} ref={fileInputRef} />
            <FaCloudUploadAlt className="text-6xl text-[#AFAFAF] -translate-y-14" />
            <span className="flex flex-col absolute bottom-16 text-sm font-normal text-[#757575] -translate-y-14">Upload New Image</span>

            {/* Existing Image */}
            {existingImage && !imagePreview && (
              <img src={existingImage} alt="Existing" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
            )}

            {/* New Image Preview */}
            {imagePreview && <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />}

            <button onClick={handleButtonClick} className="absolute bottom-5 px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg">
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
