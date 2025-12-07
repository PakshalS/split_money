import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageNavigationbar from "../pagenavbar";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import useAuthRedirect from '../../context/useauthredirect';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  useAuthRedirect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const Navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://split-money-api.vercel.app/auth/register", {
        name,
        email,
        password,
      });
      Navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <PageNavigationbar />
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-teal-500 rounded text-white hover:bg-teal-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-500 hover:text-teal-400">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;