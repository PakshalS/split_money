import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageNavigationbar from "../pagenavbar";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await axios.post("http://localhost:3000/auth/register", {
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
    <div className="min-h-screen flex items-center justify-center bg-auth-back">
      <PageNavigationbar />
      <div className="bg-black p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-teal-500 rounded text-white hover:bg-teal-600"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-500">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
