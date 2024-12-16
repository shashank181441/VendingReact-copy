import { Loader } from 'lucide-react';
import React from 'react';

function LoadingComp() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="flex flex-col items-center">
        <Loader className="animate-spin w-32 h-32 mb-4 text-orange-400" />
        <p className="text-lg font-semibold text-gray-700">Loading, please wait...</p>
      </div>
    </div>
  );
}

export default LoadingComp;
