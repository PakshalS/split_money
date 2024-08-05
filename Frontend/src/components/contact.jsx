import React from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const Contact = () => {
  return (
    <div id="contact" className="bg-gray-950 text-white p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h4 className="font-bold">Cash-Splitter</h4>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Account</h4>
          <ul>
            <RouterLink to="/login" onClick={() => setIsOpen(false)}>
              <li>
                <span className="hover:underline">Log in</span>
              </li>
            </RouterLink>
            <RouterLink to="/register" onClick={() => setIsOpen(false)}>
            <li>
              <span href="#" className="hover:underline">
                Sign up
              </span>
            </li>
            </RouterLink>
            <li>
              <a href="#" className="hover:underline">
                Reset password
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Settings
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">More</h4>
          <ul>
            <li>
              <a
                href="https://pakshalprofilewebsite-pakshals-projects.vercel.app/"
                target="_blank"
                className="hover:underline"
              >
                Contact us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <a href="https://x.com/pakshalhere" target="_blank">
              {" "}
              <FaTwitter className="text-white hover:text-gray-400" />
            </a>
            <a href="https://github.com/PakshalS" target="_blank">
              {" "}
              <FaGithub className="text-white hover:text-gray-400" />
            </a>
            <a
              href="https://www.linkedin.com/in/pakshal-shah-946368244/"
              target="_blank"
            >
              {" "}
              <FaLinkedin className="text-white hover:text-gray-400" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center md:items-start">
          <p className="text-center md:text-left mt-4">
            Made with :) love by PAKSHAL SHAH
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
