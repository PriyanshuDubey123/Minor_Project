import React from 'react'
import {NavLink} from 'react-router-dom'
import logo from "../images/logo.png";

const navbar = () => {
  return (
    <>
    <nav className='w-full md:h-14 bg-gray-50 md:flex justify-between items-center px-4 md:px-5'>
      {/* <div className='flex-col pt-6'> */}
    <img class="w-14 h-14 pt-1" src={logo} alt="" />
      {/* </div> */}
      <NavLink className="text-2xl  pt-0 font-extrabold  text-purple-900 border-black " to="/">
      ULearn
      </NavLink>
      <ul className='flex font-semibold text-[18px] text-indigo-700 w-[1200px] pt-0'>
        <NavLink className='mx-[10px] cursor-pointer hover:text-sky-950' to="/courses">Courses</NavLink>
        <NavLink className='mx-[10px] cursor-pointer hover:text-sky-950' to="/about">About Us</NavLink> 
        <NavLink className='mx-[10px] cursor-pointer hover:text-sky-950' to="/contact">Contact Us</NavLink> 
      </ul>
      <div className='pt-2'>
      <button className='bg-indigo-700 text-white px-3 py-2 rounded-[10px] hover:bg-blue-600 hover:text-slate-950'>Login/SignUp</button>
      </div>
    </nav>
    </>
  )
}

export default navbar