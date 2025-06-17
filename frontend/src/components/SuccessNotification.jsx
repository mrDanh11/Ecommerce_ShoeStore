import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

/**
 * SuccessNotification
 * Props:
 * - message: string
 * - duration: number (ms), default 2000
 * - onClose: callback when done
 */
const SuccessNotification = ({ message, duration = 2000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), duration);
    // Cleanup and call onClose after fade-out
    const remove = setTimeout(() => onClose && onClose(), duration + 300);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [duration, onClose]);

  return (
    <div
      className={
        `fixed z-50 transition-all duration-500 ease-out ` +
        (visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4') +
        ` top-4 left-1/2 transform -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:top-20 md:right-4`
      }
    >
      <div className="flex items-center bg-green-50 border border-green-300 text-green-800 px-5 py-3 rounded-lg shadow-lg hover:shadow-xl">
        <FiCheckCircle className="w-6 h-6 mr-2 text-green-600 animate-pulse" />
        <span className="font-medium text-sm sm:text-base">{message}</span>
      </div>
    </div>
  );
};

export default SuccessNotification;
