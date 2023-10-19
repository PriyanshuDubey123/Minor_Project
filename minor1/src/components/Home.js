import React from 'react'
const Home = () => {
  return (
    <>
    <div className='flex h-[660px] w-full justify-center text-center pt-3'> 
    <div className='flex-col w-[780px] pt-[230px] text-center text-sky-950'>
<div className='text-5xl font-bold pb-2'>Discover a new world of learning. </div>
<div className='text-4xl font-bold pb-2'>Classroom enviroment at home. </div>
<div className='text-3xl font-bold pb-2'>Learn from top educators. </div>
<div className='pt-2 '>
<button className='bg-indigo-700 text-white px-3 py-2 rounded-[10px] hover:bg-blue-600 hover:text-slate-950  '>Visit Courses</button>
</div>
</div>
   <img className='w-[630px] pt-0' src="https://o.remove.bg/downloads/2790741c-81a5-4f4e-b998-f72f4957d404/img-1-removebg-preview.png" alt="" />
    </div>
    </>
  )
}
export default Home