import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom'; 
import { getVendingMachinesByOwner, deleteVendingMachine } from '../../api/api'; // Import delete API
import { Edit, Trash2 } from 'lucide-react';

function AdminVendingMachines() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  // Setup the mutation for deleting a vending machine
  const { mutate: deleteMutate } = useMutation({
    mutationFn: async (id) => {
      // Call the API to delete the vending machine by ID
      const res= await deleteVendingMachine(id);
      console.log(res)
      return res;
    },
    onSuccess: () => {
      // Refetch the vending machines data or update the local state
      queryClient.invalidateQueries(['vendingMachines']);
    },
    onError: (error) => {
      console.error('Error deleting vending machine:', error.message);
    },
  });

  const columns = useMemo(
    () => [
      {
        header: 'S.No.',
        accessorKey: 'serialNumber',
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        header: 'Location',
        accessorKey: 'location',
        cell: (info) => (
          <Link to={`/admin/products/${info.row.original._id}`}>
          {info.getValue()}
          </Link>
          ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => info.getValue() ? "active" : "inactive",
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      {
        header: 'Updated At',
        accessorKey: 'updatedAt',
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      {
        header: 'Actions', 
        accessorKey: 'actions',
        cell: ({ row }) => (
          <div className="space-x-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate(`/admin/vending-machines/edit/${row.original._id}`)}
            >
              <Edit/>
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => deleteMutate(row.original._id)} // Pass the ID to deleteMutate
            >
              <Trash2/>
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [navigate, deleteMutate]
  );

  const { data: vendingMachines, isLoading, error: vendingMachinesError } = useQuery({
    queryKey: ['vendingMachines'],
    queryFn: async () => {
      const response = await getVendingMachinesByOwner();
      return response.data.data;
    },
    initialData: [],
  });

  const table = useReactTable({
    columns,
    data: vendingMachines || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'serialNumber', desc: false }] },
  });

  if (isLoading) return <div>Loading...</div>;
  if (vendingMachinesError) return <div>Error: {vendingMachinesError.message}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center">Vending Machines</h1>
      <div className="overflow-x-auto">
        <Link to="/admin/vending-machines/create">Add Machine</Link>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] || null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4 border-t">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminVendingMachines;
