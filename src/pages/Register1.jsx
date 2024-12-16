import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../api/api";
import { Link } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  avatar: z.any().optional(),
});

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreviews, setCoverImagePreviews] = useState([]);

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    console.log(Array.from(formData));
    try {
      const registerData = await registerUser(formData);
      console.log(registerData);
    } catch (error) {
      console.warn(error);
    }
  };

  // Function to handle avatar file change and display preview
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Function to handle cover images file change and display preview
  const handleCoverImageChange = (event) => {
    const files = Array.from(event.target.files);
    setCoverImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        
        {/* Username Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Full Name Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register("fullName")}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Avatar File Input */}
        <div className="mb-4">
          <label >Avatar</label>
          <input
            type="file"
            {...register("avatar")}
            onChange={handleAvatarChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {avatarPreview && (
            <img src={avatarPreview} alt="Avatar Preview" className="mt-2 max-w-full h-auto" />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Register
        </button>
        <div className="justify-center text-center mt-2">
          <span className="opacity-50">
            If you already have an account,{" "}</span>
            <Link to="/login" className="text-blue-900">Log in</Link>

        </div>
      </form>
    </div>
  );
}

export default Register;
