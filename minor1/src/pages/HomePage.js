import React from 'react'
import Navbar from '../features/navbar/Navbar';
import Sidebar from '../features/sidebar/Sidebar';
import {  Outlet } from 'react-router-dom';
function HomePage() {



  return (
    <>
  
    <Navbar>
     <Sidebar>
     <Outlet/>
     </Sidebar>
    </Navbar>
    </>
  )
}

export default HomePage