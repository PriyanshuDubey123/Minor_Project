import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseByIdAsync, selectCourseById } from '../CourseSlice';
import { selectLoggedInUser } from '../../auth/authSlice';
import { addToCartAsync, selectItems } from '../../cart/cartSlice';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {StarIcon} from "@heroicons/react/20/solid";
import { discountedPrice } from '../../../app/constants';
import { fetchCourseById } from '../CourseAPI';
import { Link } from 'react-router-dom';
import { selectToggle } from '../../ToggleSlice';

function CourseGrid({ courses }) {
    
    const course = useSelector(selectCourseById);
    const user = useSelector(selectLoggedInUser);
    const items = useSelector(selectItems);

    const isOpen = useSelector(selectToggle);

    console.log(isOpen);
  
    return (
      <>
        <div className="lg:col-span-3 ">
          {/* Your Code */}
          <div>
            <div className="bg-white">
              <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                <div className={`mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2  xl:gap-x-8  ${!isOpen ? 'lg:grid-cols-2 w-[50vw]':'lg:grid-cols-3'}`}>
                  {courses && courses?.map((course) => (
                      <div
                        key={course._id}
                        className="group relative border-solid border-2 border-gray-200 rounded-md "
                      >
                       
                    <Link to={`/course-detail/${course._id}`}>
                        <div className="mt-4 flex justify-between flex-col">
                          <div className="flex justify-between px-2 items-center gap-2 pb-3  font-bold">
                            <h3 className="text-sm text-black text-[1rem]">
                              <div href={course.thumbnailUrl}>
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                                {course.name}
                              </div>
                            </h3>
                            <div className=' flex gap-3 justify-center items-center'>
                            <button className=" bg-yellow-300 font-bold rounded-md text-black p-2">New</button>
                            <WhatsAppIcon className=" rounded-full bg-green-500 text-white"/>
                            </div>
                          </div>
                          <div>
                          
                          <div className=" min-h-72 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-72">
                          <img src={course.thumbnailUrl} alt={course.name} className=" h-full w-full" />
                        </div>    
                        <div className="flex justify-between items-center p-2 font-bold text-sm flex-col">
                          <p className=' text-gray-700 text-center'>For {course.category} 2024 students</p>
  
                            <p className="mt-1 text-sm text-gray-500 text-center">
                              <StarIcon
                                style={{ color: "gold" }}
                                className="w-6 h-6 inline"
                                />
                              <span className="align-bottom ">
                                No rated yet
                              </span>
                            </p>
                                </div>
                          </div>
                          <div className="flex gap-2 items-center pl-2 pb-2 justify-around">
                            <p className=" text-blue-500 text-[1.2rem] font-bold">
                                {course.price!==0?'₹' : null}
                              {course.price!==0 ? discountedPrice(course):'Free'}
                            </p>
                            {course.price !==0 && <p className="text-sm line-through font-medium text-gray-900">
                            ₹{course.price}
                            </p>}
                          </div>
                            <p className="text-sm font-bold text-white bg-purple-500 rounded p-1 text-center">
                              Discount of 10% Applied
                            </p>
                        </div>
                           </Link>
                        {course.deleted && (
                          <div>
                            
                            <p className=" text-sm text-red-400">
                              Course Expired
                            </p>
                          </div>
                        )}
                       
                          <div>
                            <hr className=" mt-2 "/>
                            <div className="flex justify-around py-2 px-1">
                            <button className=" bg-gray-100 text-black rounded-md p-2 w-full font-bold">See Details</button>
                           
                            </div>
                          </div>
                      
                      </div>
                    
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

export default CourseGrid