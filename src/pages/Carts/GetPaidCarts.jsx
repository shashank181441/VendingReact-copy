import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table';
import { getPaidCartsByMachine } from '../../api/api';
import { useParams } from 'react-router-dom';

function GetPaidCarts() {
  const { machineId } = useParams();

  const groupCartItemsByProduct = (cartItems) => {
    if (!Array.isArray(cartItems)) return [];

    const groupedItems = cartItems.reduce((acc, item) => {
      const productId = item?.productId?._id;
      if (!productId) return acc;

      if (!acc[productId]) {
        acc[productId] = {
          ...item,
          quantity: 0,
          totalAmount: 0,
        };
      }

      acc[productId].quantity += item.quantity || 0;
      acc[productId].totalAmount += (item.quantity || 0) * (item.productId?.price || 0);

      return acc;
    }, {});

    return Object.values(groupedItems);
  };

  const columns = useMemo(
    () => [
      {
        header: 'S.No.',
        accessorKey: 'serialNumber',
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        header: 'P.No.',
        accessorKey: 'productId.productNumber',
        cell: (info) => info.getValue() || 'N/A',
      },
      {
        header: 'Product Name',
        accessorKey: 'productId.name',
        cell: (info) => info.getValue() || 'N/A',
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: (info) => info.getValue() || 0,
      },
      {
        header: 'Price',
        accessorKey: 'productId.price',
        cell: (info) => {
          const price = info.getValue();
          return typeof price === 'number' ? `Rs. ${price.toFixed(2)}` : 'N/A';
        },
      },
      {
        header: 'Total Amount',
        accessorKey: 'totalAmount',
        cell: (info) => {
          const amount = info.getValue();
          return typeof amount === 'number' ? `Rs. ${amount.toFixed(2)}` : 'N/A';
        },
        sortingFn: 'basic',
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleString() : 'N/A';
        },
      },
      {
        header: 'Updated At',
        accessorKey: 'updatedAt',
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleString() : 'N/A';
        },
      },
    ],
    []
  );

  const { data: paid_carts, isLoading, error } = useQuery({
    queryKey: ['paid_carts', machineId],
    queryFn: async () => {
      const response = await getPaidCartsByMachine(machineId);
      return response?.data?.data;
    },
    initialData: [],
  });

  const groupedCartItems = useMemo(() => groupCartItemsByProduct(paid_carts), [paid_carts]);

  const totalQuantity = groupedCartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const totalAmount = groupedCartItems.reduce((sum, item) => sum + (item?.totalAmount || 0), 0);

  const table = useReactTable({
    columns,
    data: groupedCartItems,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
  });

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center">Paid Carts</h1>
      <div className="overflow-x-auto">
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
                    {header.column.getIsSorted() && (
                      <span className="ml-1">
                        {header.column.getIsSorted() === 'desc' ? '🔽' : '🔼'}
                      </span>
                    )}
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
          <tfoot className="bg-gray-200">
            <tr>
              <td colSpan={3} className="text-right py-3 px-4 font-semibold">Total:</td>
              <td className="py-3 px-4 border-t font-semibold">{totalQuantity}</td>
              <td></td>
              <td className="py-3 px-4 border-t font-semibold">Rs. {totalAmount.toFixed(2)}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default GetPaidCarts;