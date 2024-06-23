import React from 'react'
import homeimg from "../images/imghome.png";
import logo from "../images/logo.png";
import Goals from './GoalsApi';
import {Link} from 'react-router-dom';
import Navbar from './Navbar';

const LandingPage = () => {
  return (
    <>
    <Navbar/>
    {/* Front Section */}
    <div className='flex h-[660px] w-full justify-center text-center pt-3 bg-slate-50'> 
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
<div className='px-36 py-[10px] w-full bg-slate-50'> 
    <h1 className='mt-3  text-center capitalize text-5xl font-extrabold text-indigo-900'>Popular Goals</h1>
    <hr className='w-[20%] m-2 h-1 mx-auto bg-slate-700 rounded'/>
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
    <div className='flex justify-end pb-12'>
      <button className='px-4 py-2 bg-slate-400  rounded-[10px] border border-black hover:text-white  hover:bg-slate-800'>See All Goals</button>
      </div>    
    </div> 

{/*Students  */}
<div className=" stu1 h-auto w-100 flex flex-wrap flex-col items-center text-center p-10 bg-slate-500">
    <div className="ctu2 h-auto flex flex-wrap flex-col items-center text-center">
        <p className="text-slate-950 font-extrabold  text-4xl text-center ">"Pure Hardwork,No Shortcuts!"</p>
        <div className="w-40 h-1 bg-slate-800 mt-2 rounded-2xl md:mt-4"></div>
        
</div>

<div className="w-full flex flex-wrap justify-evenly mt-12 ">
<div className="w-64 flex flex-col items-center mb-12 ">
<img className="w-30 h-30" src="https://cdn-icons-png.flaticon.com/128/8638/8638698.png" alt=""/>
<p className="text-3xl font-bold text-white">200+</p>
<p className="text-3xl font-bold text-purple-950">Different Courses</p>
</div>
<div className="w-64 flex flex-col items-center mb-12 ">
    <img className="w-30 h-30" src="https://cdn-icons-png.flaticon.com/128/2641/2641333.png" alt=""/>
    <p className="text-3xl font-bold text-white">5,000+</p>
    <p className="text-3xl font-bold text-purple-950">Students Enrolled</p>
    </div>
    <div className="w-64 flex flex-col items-center mb-12 ">
        <img className="w-30 h-30" src="https://cdn-icons-png.flaticon.com/128/10155/10155979.png" alt=""/>
        <p className="text-3xl font-bold text-white">300+</p>
        <p className="text-3xl font-bold text-purple-950">Top Educators</p>
        </div>
</div>
 </div>

 {/* Our Services */}
 <div className="pt-24 pb-20 h-auto w-100 flex flex-wrap flex-col items-center text-center p-10 bg-slate-200">
    <div className="h-auto flex flex-wrap flex-col items-center text-center ">
        <p className="pt-2 text-blue-900 font-extrabold text-2xl md:text-4xl text-center">Our Services</p>
    <div className="w-32 h-1 bg-slate-700 mt-2 rounded-2xl md:mt-4"></div>
    </div>

    <div className="w-full flex flex-wrap justify-evenly mt-12">
        <div className="w-64 flex flex-col items-center mb-12 border-gray-700 border-2 rounded-[25px] p-2 pt-5 pb-4 bg-gray-300">
        <img className="w-28 h-28" src="https://cdn-icons-png.flaticon.com/128/3214/3214781.png" alt=""/>
        <p className="pt-2 text-3xl font-bold text-purple-950">Live Interacting Classes</p>
        <p className="text-xl font-semibold text-gray-700">Learn from anywhere with one on one live interacting class by expert teachers. </p>
        </div>
        <div className="w-64 flex flex-col items-center mb-12  border-gray-700 border-2 rounded-[25px] p-2 pt-5 pb-4 bg-gray-300">
            <img className="w-28 h-28" src="https://cdn-icons-png.flaticon.com/128/10073/10073813.png" alt=""/>
            <p className="pt-2 text-3xl font-bold text-purple-950">Well Monitered Session</p>
            <p className="text-xl font-semibold text-gray-700">Live sessions are strictly monitored for proper attendance which provides classroom experience.</p>
            </div>
        <div className="w-64 flex flex-col items-center mb-12 border-gray-700 border-2 rounded-[25px] p-2 pt-5 pb-4 bg-gray-300">
                <img className="w-28 h-28 " src="https://cdn-icons-png.flaticon.com/128/2949/2949758.png" alt=""/>
                <p className="pt-2 text-3xl font-bold text-purple-950">Daily Assesments</p>
                <p className="text-xl font-semibold text-gray-700">Regular assesments are provided and evaluated by the mentors to check student's performance.</p>
                </div>
        <div className="w-64 flex flex-col items-center mb-12 border-gray-700 border-2 rounded-[25px] p-2 pt-5 pb-4 bg-gray-300">
                    <img className="w-28 h-28" src="https://cdn-icons-png.flaticon.com/128/8276/8276018.png" alt=""/>
                    <p className="pt-2 text-3xl font-bold text-purple-950">Weekly Progress Report</p>
                    <p className="text-xl font-semibold text-gray-700">Progess report is provided every week on the basis of assesments marks and attendance record.</p>
        </div>
    </div>
</div>


{/* Footer */}
<footer class="w-full bg-slate-700 px-4 text-white pt-14 py-10 flex flex-wrap flex-col md:flex-row justify-between md:px-12">
    <div>
        <img class="w-34 h-32 " src={logo} alt="" />
        <p class="font-bold text-xl pl-8 px-4 ">ULearn</p>
        <p class="my-4">Email us: supportul8@gmail.com</p>

        <img class="h-34 w-32 pb-3" src="https://cdn-icons-png.flaticon.com/128/3227/3227053.png" alt=""/>
    </div>
    <div>
        <h2 class="font-bold text-xl mt-4">ULearn</h2>
        <div class="w-36 h-1 bg-indigo-400 mt-2 rounded-2xl md:mt-4"></div> 
        <div class="mt-4">
            <p>About Us</p>
            <p>FAQs</p>
            <p>Privacy Policy</p>
        </div>
    </div>
    <div>
        <h2 class="font-bold text-xl mt-4">Services</h2>
        <div class="w-36 h-1 bg-indigo-400 mt-2 rounded-2xl md:mt-4"></div> 
        <div class="mt-4">
            <p>Live interacting classes</p>
            <p>Session monitoring</p>
            <p>Assesments</p>
            <p>Progress Report</p>
        </div>
    </div>
    <div>
        <h2 class="font-bold text-xl mt-4">Links</h2>
        <div class="w-36 h-1 bg-indigo-400 mt-2 rounded-2xl md:mt-4"></div> 
        <div class="mt-4">
            <Link to="https://www.youtube.com/">Ulearn Youtube</Link>
            <br />
            <Link to="">Discord Channel</Link>
            <br />
            <Link to="">Telegram Channel</Link>
        </div>
    </div>
</footer>
    </>
  )
}
export default LandingPage