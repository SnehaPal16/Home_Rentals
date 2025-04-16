import React from 'react'
import { Navbar } from "../components/Navbar.jsx";
import  Slide  from "../components/Slide.jsx";
import Categories from '../components/Categories.jsx';
import Listings from '../components/Listings.jsx';
import Footer from '../components/Footer.jsx';


const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <Slide/> 
      <Categories/>  
      <Listings/>  

      <Footer/> 
    </div>
  )
}

export default HomePage