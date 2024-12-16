import React, { useMemo, useState } from 'react';
import { differenceInSeconds, format, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { getPaidCartsByMachine } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingComp from '../../components/LoadingComp';
import ErrorPage from '../../components/ErrorPage';
import { ChevronDown, ChevronRight } from 'lucide-react';

const PurchaseLogs = () => {
  const { machineId } = useParams();
  const { data: paid_carts, isLoading, error } = useQuery({
    queryKey: ['paid_carts', machineId],
    queryFn: async () => {
      const response = await getPaidCartsByMachine(machineId);
      return response.data.data;
    },
    initialData: [],
  });
const navigate = useNavigate()
  const groupedPurchases = useMemo(() => {
    const sorted = [...paid_carts].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return sorted.reduce((acc, item) => {
      const date = parseISO(item.updatedAt);
      const monthKey = format(date, 'yyyy-MM');
      const dayKey = format(date, 'yyyy-MM-dd');

      if (!acc[monthKey]) {
        acc[monthKey] = {};
      }
      if (!acc[monthKey][dayKey]) {
        acc[monthKey][dayKey] = [];
      }

      const lastPurchase = acc[monthKey][dayKey][acc[monthKey][dayKey].length - 1];
      if (!lastPurchase || differenceInSeconds(parseISO(lastPurchase[0].updatedAt), date) > 1) {
        acc[monthKey][dayKey].push([item]);
      } else {
        lastPurchase.push(item);
      }

      return acc;
    }, {});
  }, [paid_carts]);

  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDay = (day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  if (isLoading) return <LoadingComp />;
  if (error) return <ErrorPage />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Paid Products</h1>
      <button onClick={()=>navigate(`/admin/carts/printDetails/${machineId}`)}
      className='bg-black text-white px-3 py-2 rounded-md font-bold justify-end mb-3'>
        Print
      </button>
      </div>
      {Object.entries(groupedPurchases).map(([month, days]) => (
        <div key={month} className="mb-8 bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => toggleMonth(month)}
            className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-700 mb-4"
            aria-expanded={expandedMonths[month]}
          >
            <span>{format(parseISO(`${month}-01`), 'MMMM yyyy')}</span>
            {expandedMonths[month] ? <ChevronDown className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </button>
          {expandedMonths[month] && Object.entries(days).map(([day, purchases]) => (
            <div key={day} className="ml-4 mb-4">
              <button
                onClick={() => toggleDay(day)}
                className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-600 mb-2"
                aria-expanded={expandedDays[day]}
              >
                <span>{format(parseISO(day), 'EEEE, MMMM d')}</span>
                {expandedDays[day] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              {expandedDays[day] && purchases.map((purchase, purchaseIndex) => (
                <div key={purchaseIndex} className="ml-4 mb-4 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Purchase at {format(parseISO(purchase[0].updatedAt), 'HH:mm:ss')}
                  </h3>
                  <div className="space-y-2">
                    {purchase.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">{item?.productId?.name}</h4>
                          <p className="text-xs font-bold text-gray-600">#{item?.productId?.productNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">Rs. {item?.productId?.price * item?.quantity}</p>
                          <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <p className="text-sm font-bold text-gray-800">
                      Total: Rs. {purchase.reduce((sum, item) => sum + item?.productId?.price * item.quantity, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PurchaseLogs;