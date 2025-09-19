
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 text-center z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
        AI Image Generator
      </h1>
      <p className="mt-2 text-lg text-gray-400">Powered by Gemini</p>
    </header>
  );
};

export default Header;
