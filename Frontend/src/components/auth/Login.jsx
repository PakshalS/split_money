import React, { useState , useContext} from 'react';
import { Link } from 'react-router-dom';
import PageNavigationbar from '../pagenavbar';
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/authcontext';
import useAuthRedirect from '../../context/useauthredirect';

const Login = () => {
  useAuthRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use context for login


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =await axios.post("https://split-money-api.vercel.app/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      login(token);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-back">
          <PageNavigationbar/>
      <div className="bg-black p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4 text-right">
            <Link to="/forgot-password" className="text-sm text-gray-400">Forgot Password?</Link>
          </div>
          <button type="submit" className="w-full p-2 bg-teal-500 rounded text-white hover:bg-teal-600">
            Log In
          </button>
        </form>
        <div className="text-center mt-4 text-gray-400">
          Don't have an account? <Link to="/register" className="text-teal-500">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
