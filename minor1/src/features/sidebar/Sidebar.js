import React, { useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MessageIcon from '@mui/icons-material/Message';
import BookIcon from '@mui/icons-material/Book';
import QuizIcon from '@mui/icons-material/Quiz';
import PhonePausedIcon from '@mui/icons-material/PhonePaused';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import PaidIcon from '@mui/icons-material/Paid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../ToggleSlice';

function Sidebar({ children }) {
  const [toggle, setToggle] = useState(false);
  const [show, setShow] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleShow = () => {
    setToggle(!toggle);
    dispatch(toggleSidebar());
    if (!toggle) setShow(false);
    else {
      setTimeout(() => {
        setShow(true);
      }, 205);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const sideBarOptions = [
    { name: 'Study', icon: <BookIcon />, to: '/home/study' },
    { name: 'Friends', icon: <GroupAddIcon />, to: '/home/friends' },
    { name: 'Messages', icon: <MessageIcon />, to: '/home/messages' },
    { name: 'Transactions', icon: <PaidIcon />, to: '/home/transactions' },
    { name: 'Your Progress', icon: <DonutSmallIcon />, to: '/home/your-progress' },
    { name: 'Test Series', icon: <QuizIcon />, to: '/home/test-series' },
    { name: 'Contact Us', icon: <PhonePausedIcon />, to: '/home/contact-us' },
  ];

  return (
    <>
      <div className="w-full h-screen bg-back object-cover flex items-center flex-row ">
        {/* Sidebar */}
        <div className={`${toggle ? "small-sidebar " : "sidebar-container"} top-[4rem] left-0 z-[10]`}>
          <div
            className="flex justify-center items-center -left-5 w-10 h-10 rounded-full cursor-pointer"
            onClick={handleShow}
          >
            <BiChevronLeft
              className={`ml-2 text-white bg-purple-500 rounded-full ${toggle ? "rotate-180" : ""} absolute text-3xl transition-all duration-300 left-0`}
            />
            {!toggle && show && (
              <div className="bg-gray-300 w-[12rem] text-center h-[3rem] flex text-2xl font-bold justify-center items-center rounded transition-all duration-500 absolute left-[4rem]">
                StudyMate
              </div>
            )}
          </div>
          <div className="mt-2">
            <hr />
          </div>
          <div className="pt-1">
            {sideBarOptions.map((item) => (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.to)}
                className={`rounded flex items-center gap-4 p-5 transition duration-150 border-b-2 border-transparent cursor-pointer ${
                  location.pathname.endsWith(item.to) ? 'bg-slate-50 border-purple-500' : 'hover:bg-slate-50 hover:border-purple-500'
                }`}
              >
                <div className="h-6 w-6">{item.icon}</div>
                {!toggle && show && <p>{item.name}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`absolute top-1 ${toggle ? "smallmode" : "largemode"}`}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
