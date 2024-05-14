'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiMenuBurger } from 'react-icons/ci';

const NaYid = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsFixed(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed bg-slate-50 top-0 left-0 w-full overflow-y-hidden z-10 `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <img src="/logo.png"  className='w-[100px]'/>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/ollamamenu"
                className="text-blue-900 hover:text-blue-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in"
              >
                ollama
              </Link>
              <Link
                href="/groqmenu"
                className="text-blue-900 hover:text-blue-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in"
              >
                Groq
              </Link>
              <Link
                href="/search"
                className="text-blue-900 hover:text-blue-950 hover:underline px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in"
              >
                Search
              </Link>
              <Link
                href="/groq"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>

            </div>
          </div>
          <div  className="text-gray-300 hover:cursor-pointer hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
          <CiMenuBurger className='text-[30px]' />

          </div>
        </div>
      </div>
    </nav>
  );
};

export default NaYid;