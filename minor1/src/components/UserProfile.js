import React from 'react';
import EnrolledCourseAPI from './EnrolledCourseAPI';
// import {Link} from 'react-router-dom';

const UserProfile = () => { 
  return (
<>
<div className=' md:flex'>
    {/* side bar */}
    <div className='hidden md:flex md:flex-col w-[22%] h-screen items-center bg-indigo-500 fixed'>
            <img className='w-[100px] h-[100px] mt-16 hover:text-white' src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" alt="" />
            <div className='font-extrabold text-3xl pb-10 text-lime-50'>Shaily Shah</div>
            <div className='font-bold text-xl pb-5 hover:text-white underline'>Edit Profile</div>
            <div className='font-bold text-xl pb-5 hover:text-white underline'>Update Picture</div>
            <div className='font-bold text-xl pb-5 hover:text-white underline'>View Attendence</div>
            <div className='font-bold text-xl pb-5 hover:text-white underline'>Home</div>
            <div className='font-bold text-xl pb-5 hover:text-white underline'>Logout</div>
    </div>

{/* Right Section */}
    <div className='md:w-[78%] md:flex-col md:ml-[22%] h-screen bg-slate-100 '>

      {/* Personal Information */}
      <div className='pt-10 pl-5 text-3xl font-extrabold '>Personal Details</div>
   <div className="grid justify-center md:grid-cols-2 "> 
   <div className='pl-10 pt-6'>
    <div className='pl-2 pb-1 text-purple-950 text-xl font-bold'>Name</div>
    <div className='bg-indigo-300 w-[430px] rounded-xl p-2 pl-3 font-semibold '>Shaily Shah</div>
   </div>
   <div className='pl-10 md:pt-6 pt-4'>
    <div className='pl-2 pb-1 text-purple-950 text-xl font-bold'>Email</div>
    <div className='bg-indigo-300 w-[430px] rounded-xl p-2 pl-3 font-semibold '>sshah6@gmail.com</div>
   </div>
   <div className='pl-10 pt-4'>
    <div className='pl-2 pb-1 text-purple-950 text-xl font-bold'>Education</div>
    <div className='bg-indigo-300 w-[430px] rounded-xl p-2 pl-3 font-semibold '>12th(CBSE)</div>
   </div>
   <div className='pl-10 pt-4'>
    <div className='pl-2 pb-1 text-purple-950 text-xl font-bold'>Phone Number</div>
    <div className='bg-indigo-300 w-[430px] rounded-xl p-2 pl-3 font-semibold '>845355463335</div>
   </div>
   <div className='pl-10 pt-4'>
    <div className='pl-2 pb-1 text-purple-950 text-xl font-bold'>Institutuion</div>
    <div className='bg-indigo-300 w-[430px] rounded-xl p-2 pl-3 font-semibold '>SD Senior Secondary School</div>
   </div>
   <div className='pl-10 pt-4'>
    <div className='pl-2 pb-1 text-purple-950 text-xl font-bold'>Language</div>
    <div className='bg-indigo-300 w-[430px] rounded-xl p-2 pl-3 font-semibold '>English</div>
   </div>
   </div> 

{/*My Interests */}
   <div className='bg-slate-100'>
        <div className='pt-12 pl-5 text-3xl font-extrabold '>
         My Interests
        </div>
   <div class="px-6 pt-7 pb-2 ">
    <span class="inline-block bg-indigo-200 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2">Science</span>
    <span class="inline-block bg-indigo-200 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2">Mathematics</span>
    <span class="inline-block bg-indigo-200 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2">Programming</span>
    <span class="inline-block bg-indigo-200 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2">English</span>
  </div>
</div>

      {/* Enrolled Courses */}
      <div className='bg-slate-100 '>
        <div className='pt-7 pl-5 text-3xl font-extrabold '>
         Enrolled Courses(4)
        </div>
        <div className="grid grid-cols-3 justify-items-center pt-8 pb-4">

        {EnrolledCourseAPI.map((curElem)=>{
      const{image,name,Enrolled,Valid}=curElem;
      return(
        <>
        <div class="w-[280px] h-[280px] rounded overflow-hidden shadow-lg mb-10">
      <img class="w-full h-[160px]" src={image} alt=""/>
      <div class="px-4 pt-4 pb-6 bg-indigo-200 hover:bg-sky-100">
      <div class="font-extrabold text-xl mb-2 pb-1">{name}</div>
      <div className='font-medium pt-2'>Enrolled on {Enrolled}<br/> Valid till {Valid}</div>
      </div>
      </div>
       </>)
      })}
       </div>
    </div>
</div>

</div>
</>
  )
}

export default UserProfile