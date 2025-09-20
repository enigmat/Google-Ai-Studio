import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, show }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      // Allows for fade-out animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-white font-semibold z-50 transition-all duration-300";
  const typeClasses = {
    success: "bg-green-600",
    error: "bg-red-600",
  };
  const animationClasses = show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${animationClasses}`} role="alert">
      {type === 'success' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {type === 'error' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
};

export default Toast;