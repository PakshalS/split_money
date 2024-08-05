import React, { useState, lazy, Suspense } from "react";
import axios from "axios";
const Navigationbar = lazy(() => import("../navbar"));
import Cookies from "js-cookie";

const RequestPasswordReset = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [message1, setMessage1] = useState("");
  const [error1, setError1] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.put(
        "http://localhost:3000/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setMessage1(response.data.message);
      setError1("");
    } catch (error) {
      setMessage1("");
      setError1(error.response?.data?.error || 'Error changing password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/request-password-reset",
        { emailOrUsername }
      );
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setMessage("");
      setError(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen mt-16 lg:mt-20 bg-auth-back text-white flex flex-col items-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Navigationbar />
      </Suspense>
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Request Password Reset</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            className="w-full p-2 border bg-gray-700 border-gray-600 rounded text-white"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition duration-300"
          >
            Request Password Reset
          </button>
        </form>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChange} className="flex flex-col space-y-4">
          <input
            type="password"
            className="w-full p-2 border bg-gray-700 border-gray-600 rounded text-white"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 border bg-gray-700 border-gray-600 rounded text-white"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition duration-300"
          >
            Change Password
          </button>
        </form>
        {message1 && <p className="text-green-500 mt-4">{message1}</p>}
        {error1 && <p className="text-red-500 mt-4">{error1}</p>}
      </div>
    </div>
  );
};

export default RequestPasswordReset;
