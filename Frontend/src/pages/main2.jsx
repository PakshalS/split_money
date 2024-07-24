import React from "react";
import Dashboard from "../components/secure/dashboard";
import Navigationbar from "../components/navbar";

const Homee = () => {
  return (
    <div id="home">
      <Navigationbar />
      <Dashboard/>
    </div>
  );
};

export default Homee;
