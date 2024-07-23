import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  return (
    <div id='contact' className="bg-gray-950 text-white p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h4 className="font-bold">Cash-Splitter</h4>
          <ul>
            <li><a href="#" className="hover:underline">About</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Account</h4>
          <ul>
            <li><a href="#" className="hover:underline">Log in</a></li>
            <li><a href="#" className="hover:underline">Sign up</a></li>
            <li><a href="#" className="hover:underline">Reset password</a></li>
            <li><a href="#" className="hover:underline">Settings</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">More</h4>
          <ul>
            <li><a href="#" className="hover:underline">Contact us</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <FaTwitter className="text-white hover:text-gray-400" />
            <FaFacebookF className="text-white hover:text-gray-400" />
            <FaInstagram className="text-white hover:text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center md:items-start">
          <p className="text-center md:text-left mt-4">Made with :) love in Mumbai,India</p>
        </div>
      </div>

    </div>
  );
};

export default Contact;
