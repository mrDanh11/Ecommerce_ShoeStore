import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* spinner: dual rings rotating opposite */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-b-indigo-600 rounded-full animate-spin reverse-spin"></div>
        </div>
        {/* loading Dots */}
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></div>
        </div>
        <span className="text-lg font-medium text-gray-700 animate-pulse">Loading...</span>
      </div>

      {/* custom reverse-spin animation */}
      <style>
        {`@keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }`}
        {`.reverse-spin { animation: reverse-spin 1s linear infinite; }`}  
      </style>
    </div>
  );
};

export default Loading;
