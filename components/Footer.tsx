
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full p-4 text-center text-gray-500 z-10">
      <p>&copy; {new Date().getFullYear()} AI Image Generator. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
