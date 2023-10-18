import React from 'react'
import {NavLink} from 'react-router-dom'
const navbar = () => {
  return (
    <>
    <nav className='w-full md:h-14 bg-slate-50 md:flex justify-between items-center px-4 md:px-5'>
      <div className="text-2xl font-bold  text-indigo-700 w-10">
      Ulearn
      </div>
      <ul className='flex font-semibold text-[18px] text-indigo-700 w-[1200px] pt-1'>
        <NavLink className='mx-[10px] cursor-pointer' to="/courses">Courses</NavLink>
        <NavLink className='mx-[10px] cursor-pointer' to="/about">About Us</NavLink> 
        <NavLink className='mx-[10px] cursor-pointer' to="/contact">Contact Us</NavLink> 
      </ul>
      <div className='bg-indigo-700 text-white px-3 py-2 rounded-[10px] hover:bg-blue-600 hover:text-slate-950'>Login/SignUp</div>
    </nav>
    </>
  )
}

export default navbar