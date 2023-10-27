import React from 'react'
import homeimg from "../images/imghome.png";
import Goals from './GoalsApi';



const Home = () => {
  return (
    <>
    {/* Front Section */}
    <div className='flex h-[660px] w-full justify-center text-center pt-3'> 
    <div className='flex-col pt-[230px] pl-4 text-center text-sky-950'>
    <div className='text-5xl font-bold pb-2'>Discover a new world of learning. </div>
    <div className='text-4xl font-bold pb-2'>Classroom enviroment at home. </div>
    <div className='text-3xl font-bold pb-2'>Learn from top educators. </div>
    <div className='pt-2 '>
    <button className='bg-indigo-700 text-white px-4 py-3 rounded-[10px] hover:bg-blue-600 hover:text-slate-950  '>Visit Courses</button>
    </div>
    </div>
    <img className='w-[710px] pt-0 pr-0' src={homeimg} alt="" />
    </div>

    {/* Popular Goals */}

<div className='px-36 py-[10px] w-full '> 
    <h1 className='mt-3  text-center capitalize text-5xl font-extrabold text-indigo-900'>Popular Goals</h1>
    <hr className='w-[25%] m-2 h-1 mx-auto bg-slate-700 rounded'/>
    {/* cards */}
    <div className="grid grid-cols-4 justify-items-center">

      {Goals.map((curElem)=>{
      const{image,name}=curElem;
      return(
        <>
      <div className='py-10 m-2 w-[170px] '>

      <div className='container1 rounded overflow-hidden  shadow-lg max-w-sm px-2 pb-2 h-[200px]  bg-slate-300  hover:bg-slate-800'>
       
  <img  src={image} alt="" className='w-[300px] h-[120px]'/>

      <div className='container2 font-extrabold text-2xl mb-2 bg-slate-300 text-center text-indigo-800 py-2 '>
     {name}
      </div>
      </div>
      </div>
    </>)
      })}
   
    </div>
    <div className='flex justify-end '>
      <button className='px-4 py-2 bg-slate-400  rounded-[10px] border border-black hover:text-white  hover:bg-slate-800'>See All Goals</button>
      </div>    
    </div> 


    </>
  )
}
export default Home