"use client"; 

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiSearch, FiBell } from "react-icons/fi";

export const Header: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSearch = (): void => {
    if (!searchOpen) {
      setSearchOpen(true);
      setSearchVisible(true);
    } else {
      setSearchOpen(false);
      setTimeout(() => setSearchVisible(false), 500);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setSearchOpen(false);
      setTimeout(() => setSearchVisible(false), 500);
    }
    
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <div className="relative">
      <header className="bg-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <FiMenu size={24} onClick={toggleSidebar} className="cursor-pointer" />
        </div>

        <h1 className={`font-extrabold text-xl transition-opacity duration-300 ${searchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
          Blog
        </h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch 
              className="cursor-pointer size-5 md:size-6" 
              onClick={toggleSearch} 
            />
          </div>
          <FiBell className="size-5 md:size-6" />
        </div>
      </header>

      {searchVisible && (
        <motion.div 
          ref={searchRef}
          initial={{ opacity: 0, translateX: 10 }} 
          animate={{ opacity: searchOpen ? 1 : 0, translateX: searchOpen ? 0 : 10 }} 
          exit={{ opacity: 0, translateY: -20 }} 
          transition={{ duration: 0.5 }} 
          className="absolute top-3 md:top-2 right-11 md:right-12 w-40 md:w-72 md:shadow-lg"
        >
          <input
            ref={inputRef} 
            type="text"
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            className="w-full p-2 md:border text-justify bg-transparent md:border-gray-300 rounded-lg outline-0 md:focus:outline-none md:focus:ring-2 md:focus:ring-blue-500"
            placeholder="Pesquisar..."
          />
        </motion.div>
      )}

      {sidebarOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
            onClick={toggleSidebar}
          />

          <motion.div
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}  
            exit={{ x: -300, opacity: 0 }} 
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-64 h-full bg-primary-foreground text-white shadow-lg z-50 p-4"
          >
            <h2 className="font-bold text-2xl">Menu</h2>
            <ul className="mt-6 space-y-3">
              <li><a href="/" className="block text-lg py-2">Home</a></li>
              <li><a href="#" className="block text-lg py-2">Sobre</a></li>
              <li><a href="#" className="block text-lg py-2">Contatos</a></li>
              <li><a href="#" className="block text-lg py-2">Configurações</a></li>
            </ul>
            <button onClick={toggleSidebar} className="mt-6 bg-red-500 text-white p-3 rounded text-lg">
              Fechar
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};
