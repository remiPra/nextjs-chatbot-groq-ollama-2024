'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiMenuBurger } from 'react-icons/ci';

const NaYid = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav
      className={`fixed bg-slate-50 top-0 left-0 w-full overflow-y-hidden z-10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <img src="/logo.png" className="w-[100px]" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/ollamamenu"
                className="text-blue-900 hover:text-blue-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in"
              >
                Ollama
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
            </div>
          </div>
          <div
            onClick={toggleDrawer}
            className="text-blue-800 hover:cursor-pointer hover:border-yellow-400 hover:border-2 hover:text-yellow-400 hover:font-extrabold px-3 py-2 rounded-md text-sm font-medium"
          >
            <CiMenuBurger className="text-[30px]" />
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px', zIndex: 20 }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul>
            <li onClick={toggleDrawer} className="mb-2">
              <Link href="/ollamamenu" className="text-blue-900 hover:text-blue-950">
                Ollama
              </Link>
            </li>
            <li onClick={toggleDrawer}  className="mb-2">
              <Link href="/groqmenu" className="text-blue-900 hover:text-blue-950">
                Groq
              </Link>
            </li>
            <li onClick={toggleDrawer}  className="mb-2">
              <Link href="/search" className="text-blue-900 hover:text-blue-950">
                Search
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NaYid;
