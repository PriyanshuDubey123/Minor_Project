import React from 'react'
import {NavLink} from 'react-router-dom'
const navbar = () => {
  return (
    <>
    <nav className='w-full md:h-14 bg-slate-50 md:flex justify-between items-center px-4 md:px-5'>
      <NavLink className="text-2xl font-bold  text-indigo-700 w-10" to="/">
      Ulearn
      </NavLink>
      <ul className='flex font-semibold text-[18px] text-indigo-700 w-[1200px] pt-1'>
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