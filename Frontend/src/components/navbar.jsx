import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigationbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black h-16 lg:h-20 flex justify-between items-center px-4 md:px-8 z-50 fixed w-full top-0 left-0">
      <div className="text-white text-2xl font-bold">
        <Link to="home" smooth={true} duration={500}>
          Cash Splitter
        </Link>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <ul className={`fixed top-14 left-0 w-full bg-black text-center md:relative md:top-0 md:left-0 md:w-auto md:bg-transparent md:items-center md:gap-x-14 pt-5 md:pt-0 pr-4 text-lg md:text-2xl text-white  ${isOpen ? 'block' : 'hidden'} md:flex`}>
      <li className="hover:cursor-pointer py-2 md:py-0"><Link to="Login" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Login</Link></li>
      <li className="hover:cursor-pointer py-2 md:py-0"><Link to="SignUp" smooth={true} duration={500} onClick={() => setIsOpen(false)}>SignUp</Link></li>
        <li className="hover:cursor-pointer py-2 md:py-0"><Link to="Landing" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Home</Link></li>
        <li className="hover:cursor-pointer py-2 md:py-0"><Link to="about" smooth={true} duration={500} onClick={() => setIsOpen(false)}>About</Link></li>
        <li className="hover:cursor-pointer py-2 md:py-0"><Link to="contact" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navigationbar;