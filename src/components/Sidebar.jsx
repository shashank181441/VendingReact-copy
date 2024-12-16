import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({children}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-gray-800 text-white">
        {/* Sidebar Links */}
        <div className="flex-grow mt-10">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/admin/vending-machines"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Vending Machines
            </Link>
            {/* Add more sidebar links here if needed */}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-4 py-2 mb-4">
          <button
            onClick={() => {
              // Handle logout logic here
            }}
            className="w-full flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-gray-100">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900 text-white">
          <div className="flex items-center">
            <img
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center">
            <img
              src="https://tailwindui.com/img/logos/avatar.svg"
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="p-8">
          {/* Your main content goes here */}
          {children}
        </div>
      </div>
    </div>
  );
}
