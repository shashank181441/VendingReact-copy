import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getFonePayDetails, updateUserAvatar } from '../api/api';
import { updateAccountDetails } from '../api/api'; // Assume this is the API call for updating user info
import { useNavigate } from 'react-router-dom';

function AdminUsers() {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getFonePayDetails();
      return response.data.data;
    }
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (selectedImage) {
      const formData = new FormData();
      formData.append('avatar', selectedImage);
      const res=  await updateUserAvatar({ avatar: selectedImage });
      console.log(res);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
      <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden relative">
        <img
          className="w-full h-48 object-cover cursor-pointer"
          src={user.avatar}
          alt={`${user.fullName}'s avatar`}
          onClick={() => document.getElementById('imageUpload').click()}
        />
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button
          className="absolute top-2 right-2 bg-blue-500 text-white py-1 px-3 rounded-full"
          onClick={() => document.getElementById('imageUpload').click()}
        >
          Edit Image
        </button>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
          <p className="text-gray-600">Username: {user.username}</p>
          <p className="text-gray-600">Email: {user.email}</p>
          <div className='flex justify-between flex-wrap'>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
            onClick={() => navigate("/admin/users/update")}
          >
            Edit Account
          </button>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
            onClick={() => navigate("/admin/users/fonepay")}
          >
            {user.merchantDetails ? "Update" : "Add"} FonePay Details
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
