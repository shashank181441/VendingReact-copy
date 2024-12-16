import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateVendingMachine, getVendingMachineDetails } from '../../api/api';

function EditVendingMachine() {
  const { machineId } = useParams(); // Extract machineId from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    location: '',
    status: false, // Default to false (inactive)
  });

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchVendingMachineDetails = async () => {
      try {
        const response = await getVendingMachineDetails(machineId);
        const { location, status } = response.data.data; // Assuming the data is in this structure
        setFormData({ location, status });
        setLoading(false);
      } catch (err) {
        setError('Failed to load vending machine details.');
        setLoading(false);
      }
    };

    fetchVendingMachineDetails();
  }, [machineId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVendingMachine(machineId, formData);
      navigate('/admin/vending-machines'); // Redirect after success
    } catch (error) {
      console.error('Error updating vending machine:', error);
      // Handle error appropriately, e.g., showing an alert
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error state

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Vending Machine</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter location"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Active
          </label>
          <input
            type="checkbox"
            id="status"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="mr-2 leading-tight focus:outline-none focus:shadow-outline"
          />
          <span className="text-gray-700">Is the machine active?</span>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVendingMachine;
