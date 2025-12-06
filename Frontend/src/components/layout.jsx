import React from "react";
import { Outlet } from "react-router-dom";
import Navigationbar from "./navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Fixed Navbar */}
      <Navigationbar />
      
      {/* Main Content Area with padding to account for fixed navbar */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;  