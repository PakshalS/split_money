import React from 'react'
import Navigationbar from '../components/navbar'
import Contact from '../components/contact'
import About from '../components/about'
import Landing from '../components/landing'

const Homepage = () => {
  return (
    <div id='home'>
      <Navigationbar/>
      <Landing/>
      <About/>
      <Contact/>
    </div>
  )
}

export default Homepage