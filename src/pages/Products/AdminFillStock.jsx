import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, fillStock } from '../../api/api'; // Assume you have these API functions
// import { toast } from 'react-toastify'; // Optional for better user feedback
import { useNavigate, useParams } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

function AdminFillStock() {
  const queryClient = useQueryClient();
  const {machineId} = useParams()
  const navigate = useNavigate()

  // Fetch all products using the new object format in useQuery
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async ()=>{
        const res = await getProducts(machineId)
        console.log(res)
        return res.data.data
    },
    select: (data) => data.sort((a, b) => a.productNumber - b.productNumber), // Sort products by productNumber
  });

  // Mutation for filling stock using the new format
  const fillStockMutation = useMutation({
    mutationFn: (productId) => fillStock(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refetch products after stock is filled
    //   toast.success('Stock filled successfully!');
    console.log("stock filled")
    },
    onError: (error) => {
    //   toast.error(`Error: ${error.message}`);
    console.log(error)
    },
  });

  // Handle filling stock
  const handleFillStock = (productId) => {
    fillStockMutation.mutate(productId);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Failed to load products.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Fill Stock</h1>
      <button onClick={()=>{navigate("/")}}>
        <MoveLeft/>
      </button>
      <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2">P.N.</th>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Stock Limit</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="px-4 py-2">{product.productNumber}</td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2">{product.stockLimit}</td>
              <td className="px-4 py-2">
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                  onClick={() => handleFillStock(product._id)}
                  disabled={fillStockMutation.isLoading}
                >
                  {fillStockMutation.isLoading ? 'Filling...' : 'Fill Stock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminFillStock;
