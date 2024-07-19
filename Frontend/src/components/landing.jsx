import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div id='home'className="flex flex-col md:flex-row md:top-16 items-center justify-between p-6 bg-black min-h-screen">
      <div className="text-white md:w-1/2 p-4">
        <h1 className="text-4xl md:text-6xl pt-6 font-bold mb-4">Split your <span className="text-green-500">money</span></h1>
      
        <p className="text-xl md:text-2xl mb-6">
          Setting up automatic transfers from your checking to your savings account can get you started saving money without thinking.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis maiores facere voluptate impedit? Officiis, magni dicta esse laudantium totam, repellendus amet animi deleniti aliquam sunt modi in iure porro impedit?
        </p>
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
        <img src="src/assets/logo.jpeg" alt="Application Logo" className="max-w-full h-auto"/>
      </div>
    </div>
  );
};  

export default LandingPage;
