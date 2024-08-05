import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div id='home'className="flex flex-col md:flex-row md:top-16 items-center justify-between p-6 bg-black min-h-screen">
      <div className="text-white md:w-1/2 p-4">
        <h1 className="text-4xl md:text-6xl pt-6 font-bold mb-4">Split your <span className="text-green-500">money</span></h1>
      
        <p className="text-xl md:text-2xl mb-6">
        Managing group expenses has never been easier! Our expense splitting website helps you effortlessly divide costs among friends and family. Whether it's a trip, dinner, or a shared gift, simply create a group, add expenses, and let our tool handle the rest.        </p>
        <p className="text-xl md:text-2xl mb-6  ">
        Track who owes whom, settle balances, and keep everyone on the same page. With user-friendly features and seamless calculations, splitting expenses is now hassle-free.         </p>
        <div className='flex gap-5'>
          <Link to="/login">
          <button className="bg-transparent border-2 border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-500 hover:text-black">Login</button>

          </Link>
          <Link to="/register">
          <button className="bg-transparent border-2 border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-500 hover:text-black">Register</button>

          </Link>
        </div>
      </div>
      <div className="md:w-1/2 lg:p-32 flex justify-center">
        <img src="src/assets/cropped_image.jpeg" alt="Application Logo" className="max-w-full h-auto"/>
      </div>
    </div>
  );
};  

export default LandingPage;
