'use client';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getPaidCartsByMachine } from '../../api/api';
import { ArrowLeft } from 'lucide-react';

function PrintDetails() {
  const { machineId } = useParams();
  const { data: paid_carts, isLoading, error } = useQuery({
    queryKey: ['paid_carts', machineId],
    queryFn: async () => {
      const response = await getPaidCartsByMachine(machineId);
      return response.data.data;
    },
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  // Calculate total revenue
  const totalRevenue = paid_carts?.reduce((sum, cart) => {
    const price = cart?.productId?.price || 0; // Fallback to 0 if price is undefined
    const quantity = cart?.quantity || 0; // Fallback to 0 if quantity is undefined
    return sum + price * quantity;
  }, 0);
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Sales Report Card */}
      <div className="flex py-4 cursor-pointer gap-4 text-gray-600" onClick={()=>navigate(`/admin/carts/purchaselogs/${machineId}`)}>
        <ArrowLeft/>
        <h1 className='text-xl'>Purchase Logs</h1>
      </div>
      <div className="mb-6 bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Machine Sales Report</h2>
          <p className="text-sm text-gray-500">Machine ID: {machineId}</p>
        </div>
        <div className="text-2xl font-bold text-green-600">
          Total Revenue: ₹{totalRevenue.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Total Transactions: {paid_carts.length}
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <div className="overflow-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">Product Name</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Product Number</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Quantity</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Price (₹)</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Total (₹)</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Date</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {paid_carts?.map((cart) => cart?.productId?.name && (
                <tr key={cart?._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{cart?.productId?.name}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">{cart?.productId?.productNumber}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">{cart?.quantity}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">{cart?.productId?.price}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    {(cart?.productId?.price || 0) * (cart?.quantity || 0)}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    {new Date(cart.createdAt).toISOString().split('T')[0]}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    {new Date(cart.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrintDetails;
