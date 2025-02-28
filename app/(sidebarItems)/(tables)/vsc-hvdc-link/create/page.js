'use client'; // Client-side component

import { useRouter } from 'next/navigation';
import VscForm from '@/app/components/vscForm'; // Import reusable form

const CreateVscPage = () => {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/vsc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('VSC created successfully');
        router.push('/vsc-hvdc-link'); // Redirect after creation
      } else {
        alert('Error creating VSC');
      }
    } catch (error) {
      alert('Failed to create VSC');
    }
  };

  return <VscForm initialValues={{ name: '', description: '' }} onSubmit={handleSubmit} />;
};

export default CreateVscPage;
