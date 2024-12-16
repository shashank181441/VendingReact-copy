import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input'; // Assuming Input component is in the same directory
import { registerUser } from '../api/api';

export default function Register() {
  const methods = useForm();
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    console.log(data);
    // Handle the form submission logic here
    if (data.password !== data.confirmPassword){
      alert("Passwords do not match");
      return 
    }
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('email', data.email)
    formData.append('fullName', data.fullName)
    formData.append('password', data.password)
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    console.log(Array.from(formData));
    try {
      const registerData = await registerUser(formData);
      console.log(registerData);
      navigate("/admin/login")
    } catch (error) {
      console.warn(error);
    }

  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <FormProvider {...methods}>
            <form method="POST" className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
              <Input label="Username" name="username" required />
              <Input label="Full Name" name="fullName" required />
              <Input label="Email address" name="email" type="email" required />
              <Input label="Password" name="password" type="password" required />
              <Input label="Confirm Password" name="confirmPassword" type="password" required />
              <Input label="Avatar Image" name="avatar" type="file" required />

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Register
                </button>
              </div>
            </form>
          </FormProvider>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/admin/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
