import React, { useState } from 'react'
import {BiChevronLeft}  from 'react-icons/bi';
import CourseList from '../course-list/components/CourseList';
import { BellIcon } from '@heroicons/react/24/outline';
import MessageIcon from '@mui/icons-material/Message';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import BookIcon from '@mui/icons-material/Book';
import QuizIcon from '@mui/icons-material/Quiz';
import PhonePausedIcon from '@mui/icons-material/PhonePaused';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { Link } from 'react-router-dom';
function Sidebar({children}) {

  const [toggle, setToggle] = useState(false);

  const [show, setShow] = useState(true);

  const handleShow = () =>{
    setToggle(!toggle);
    if(!toggle)
    setShow(false);
    else{
      setTimeout(()=>{
      setShow(true)
      },205);
    }
  }

  const sideBarOptions = [
    {name:'Study',icon: <BookIcon/>, to:'add-course'},
    {name:'Notifications', icon: <BellIcon/>},
    {name:'Messages',icon: <MessageIcon/>},
    {name:'Meetings',icon: <MeetingRoomIcon/>},
    {name:'Friends',icon: <Diversity1Icon/>},
    {name:'Your Progress',icon: <DonutSmallIcon/>},
    {name:'Test Series',icon: <QuizIcon/>},
    {name:'Contact Us',icon: <PhonePausedIcon/>},
  ];
  return (
    <>
    <div className='w-full h-screen bg-back object-cover flex items-center flex-row'>

      {/* Sidebar */}

      <div className={` ${toggle ? "small-sidebar": "sidebar-container"} top-[4rem] left-0 z-[999]`  }>
     <div className='flex justify-center items-center -left-5 w-10 h-10  rounded-full cursor-pointer' onClick={()=>{
     handleShow()
     }}>
      <BiChevronLeft className={` ml-2 text-white bg-purple-500 rounded-full ${toggle ? "rotate-180" : ""} absolute  text-3xl transition-all duration-300 left-0  `}/>
      

      {!toggle && show && <div className="bg-gray-300 w-[12rem] text-center h-[3rem] flex text-2xl font-bold justify-center items-center rounded transition-all duration-500 absolute left-[4rem]" >
      StudyMate
      </div>}

     </div>
     <div className='mt-2'>

     <hr/>
     </div>
     <div className='pt-1'> 
     {sideBarOptions.map((item)=>{
       return(
        <Link to={item.to}>
        <div className=' rounded flex justify-center items-center gap-4 p-5 transition duration-150 border-b-2 border-transparent hover:bg-slate-50 hover:border-purple-500 cursor-pointer'>
         {!toggle && show && <p>{item.name}</p>}
          <div className='h-6 w-6'>
        {item.icon}
          </div>
        </div>
        </Link>
      )
    })}
    </div>
      </div>

       {/* Content */}

       <div className={` absolute top-1 ${toggle ? "smallmode":"largemode"}`}>
      {children}
       </div>

    </div>
    </>
  )
}

export default Sidebar