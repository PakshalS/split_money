import React from "react";
import Contact from "../components/contact";
import About from "../components/about";
import Landing from "../components/landing";
import Footer from "../components/footer";
import Navigationbar from "../components/navbar";
const Homepage = () => {
  return (
    <div id="home">
      <Navigationbar />
      <Landing />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Homepage;
