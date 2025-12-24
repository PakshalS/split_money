import React, { useState , useContext} from 'react';
import { Link } from 'react-router-dom';
import PageNavigationbar from '../pagenavbar';
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/authcontext';
import useAuthRedirect from '../../context/useauthredirect';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  useAuthRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post("https://split-money-api.vercel.app/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      login(token);
      navigate('/home');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <PageNavigationbar/>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-200 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4 text-right">
            <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-teal-500">Forgot Password?</Link>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-2 bg-teal-500 rounded text-white hover:bg-teal-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="text-center mt-4 text-gray-400">
          Don't have an account? <Link to="/register" className="text-teal-500 hover:text-teal-400">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;