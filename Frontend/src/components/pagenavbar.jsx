import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const PageNavigationbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black h-16 lg:h-20 flex justify-between items-center px-4 md:px-8 z-50 fixed w-full top-0 left-0">
      <div className="text-white text-2xl font-bold hover:cursor-pointer hover:text-green-500 ">
        <RouterLink to="/" smooth={true} duration={500}>
          Cash Splitter
        </RouterLink>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <ul
        className={`fixed top-14 left-0 w-full bg-black text-center md:relative md:top-0 md:left-0 md:w-auto md:bg-transparent md:items-center md:gap-x-14 pt-5 md:pt-0 pr-4 text-lg md:text-2xl text-white ${
          isOpen ? 'block' : 'hidden'
        } md:flex`}
      >
        <li className="hover:cursor-pointer py-2 md:py-0 bg-transparent hover:text-green-500">
          <RouterLink to="/login" onClick={() => setIsOpen(false)}>
            Login
          </RouterLink>
        </li>
        <li className="hover:cursor-pointer py-2 md:py-0 bg-transparent hover:text-green-500">
          <RouterLink to="/register" onClick={() => setIsOpen(false)}>
            SignUp
          </RouterLink>
        </li>
        <li className="hover:cursor-pointer py-2 md:py-0 bg-transparent hover:text-green-500">
          <RouterLink to="/" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
            Home
          </RouterLink>
        </li>
      </ul>
    </nav>
  );
};

export default PageNavigationbar;
