import React from 'react';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import Course from './components/Course';
// import UserProfile from './components/UserProfile';
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";

const App = () => {
  return (
    <>
    <Router>
    <Navbar/>
    <Routes>
    <Route exact path="/" element={<Home/>}></Route>
    <Route exact path="/courses" element={<Course/>}></Route>
    <Route exact path="/about" element={<About/>}></Route>
    <Route exact path="/contact" element={<Contact/>}></Route>
    </Routes>
    </Router>
    {/* <UserProfile/> */}
    </>
  )
}

export default App