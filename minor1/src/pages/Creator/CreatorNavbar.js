// src/components/CreatorNavbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBell, FaBars, FaTimes } from 'react-icons/fa';

const CreatorNavbar = ({ onTabSelect }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    onTabSelect(tab);
    setShowMobileMenu(false); // Close mobile menu on tab select
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-xl font-bold">
          <Link to="/creator-account">Creator Dashboard</Link>
        </div>
      
        <div className="hidden md:flex space-x-4 text-black font-semibold">
          <NavLink label="Dashboard" tab="dashboard" onClick={handleTabClick} selected={selectedTab === 'dashboard'} />
          <NavLink label="Analytics" tab="analytics" onClick={handleTabClick} selected={selectedTab === 'analytics'} />
          <NavLink label="My Courses" tab="my-courses" onClick={handleTabClick} selected={selectedTab === 'my-courses'} />
        </div>
        <div className="relative flex gap-10 items-center">
          <button className="relative text-gray-700 hover:text-blue-600">
            <FaBell className="text-2xl text-black" />
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">0</span>
          </button>
          <FaUser
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="cursor-pointer text-2xl text-black"
          />
          {showProfileMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white shadow-md rounded-lg py-2 z-50">
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                My Profile
              </Link>
              <Link to="/home" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
               Close
              </Link>
            </div>
          )}
        </div>
        <div className="md:hidden">
        <button className="text-black">
            {showMobileMenu ? (
              <FaTimes className="text-2xl" onClick={toggleMobileMenu} />
            ) : (
              <FaBars className="text-2xl" onClick={toggleMobileMenu} />
            )}
          </button>
      </div>
      </div>
      {showMobileMenu && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 mt-4">
            <NavLink
              label="Dashboard"
              tab="dashboard"
              onClick={handleTabClick}
              selected={selectedTab === 'dashboard'}
              toggleMenu={toggleMobileMenu}
            />
            <NavLink
              label="Analytics"
              tab="analytics"
              onClick={handleTabClick}
              selected={selectedTab === 'analytics'}
              toggleMenu={toggleMobileMenu}
            />
            <NavLink
              label="My Courses"
              tab="my-courses"
              onClick={handleTabClick}
              selected={selectedTab === 'my-courses'}
              toggleMenu={toggleMobileMenu}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ label, tab, onClick, selected, toggleMenu }) => (
  <Link
    to={`#${tab}`}
    onClick={() => {
      onClick(tab);
    
    }}
    className={`text-black hover:text-black px-3 py-2 rounded-md ${selected ? 'bg-blue-500 text-white' : ''}`}
  >
    {label}
  </Link>
);

export default CreatorNavbar;
