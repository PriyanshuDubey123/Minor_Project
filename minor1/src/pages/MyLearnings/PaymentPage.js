import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaInstagram, FaYoutube, FaLinkedin, FaTwitter } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import {load} from '@cashfreepayments/cashfree-js'
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../features/user/userSlice';
import { discountedPrice } from '../../app/constants';
// Make sure to have Razorpay logo in your project

const PaymentPage = () => {
    const params = useParams();
    const { id } = params;
    const [course, setCourse] = useState(null);


   const user = useSelector(selectUserInfo);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/courses/getcourse/${id}`);
                console.log(response.data.course);
                setCourse(response.data.course);
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };

        fetchCourseDetails();
    }, [id]);


    let cashfree;

    let insitialzeSDK = async function () {
  
      cashfree = await load({
        mode: "sandbox",
      })
    }
  
    insitialzeSDK()
  
    const [orderId, setOrderId] = useState("")
  
  
    const getSessionId = async () => {
        try {
          const res = await axios.get(
            "http://localhost:8080/api/cashfree/payment",
            {
              params: {
                amount: discountedPrice(course),
                userId: user.id,
                courseId: course._id,
                creatorId: course.creatorId._id
              },
            }
          );
          if (res.data && res.data.payment_session_id) {
            console.log(res.data);
            setOrderId(res.data.order_id);
            return res.data.payment_session_id;
          }
        } catch (err) {
          console.log(err);
        }
      };
  
    const handlePayment = async (e) => {
      e.preventDefault()
      try {
        let sessionId = await getSessionId();
        let checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        };

        cashfree.checkout(checkoutOptions).then((res) => {
          console.log("payment initialized");
        });
      } catch (err) {
        console.log(err);
      }
  
    }


    if (!course) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Course Details */}
                <div className=' text-center'>
                    <div className=" h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 ">
                        <img src={course.thumbnailUrl} alt={course?.name} className="h-full w-full" />
                    </div>
                    <h1 className="text-3xl font-bold text-blue-700 mt-2">{course.name}</h1>
                    <p className="text-gray-700 mt-2">{course.description}</p>
                    <p className="text-gray-500 mt-1">By {course?.creatorId?.name}</p>
                    {course.creatorId && <div className=" mt-4 space-x-2 w-full flex justify-around">
                        {course.creatorId.instagram && (
                            <a href={course.creatorId.instagram} target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={24} className="text-gray-500 hover:text-blue-500" />
                            </a>
                        )}
                        {course.creatorId.youtube && (
                            <a href={course.creatorId.youtube} target="_blank" rel="noopener noreferrer">
                                <FaYoutube size={24} className="text-gray-500 hover:text-blue-500" />
                            </a>
                        )}
                        {course.creatorId.linkedin && (
                            <a href={course.creatorId.linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={24} className="text-gray-500 hover:text-blue-500" />
                            </a>
                        )}
                        {course.creatorId.twitter && (
                            <a href={course.creatorId.twitter} target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={24} className="text-gray-500 hover:text-blue-500" />
                            </a>
                        )}
                    </div>}
                </div>

                {/* Payment Section */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-inner text-center relative">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                    <div className="mb-10 flex flex-col gap-3">
                        <h3 className="text-lg font-medium text-gray-800 flex justify-between border-b border-gray-300">Course Price: <span className='flex items-center bg-green-400 text-white font-semibold px-2 rounded-lg'>₹{discountedPrice(course)}</span></h3>
                        <p className="text-gray-600 flex justify-between border-b border-gray-300">Language: <span>{course.language}</span></p>
                        <p className="text-gray-600 flex justify-between border-b border-gray-300">Category: <span>{course.category}</span></p>
                        <p className="text-gray-600 flex justify-between border-b border-gray-300">Duration: <span>{course.duration}hours</span></p>
                        <p className="text-gray-600 flex justify-between border-b border-gray-300">Special: <span>{course.special}</span></p>
                    </div> 
                    <div className="flex items-center justify-between mb-4 pb-2 rounded-md flex-col gap-2">
                        <div className=' flex justify-center items-center gap-2 font-semibold w-full'>
                        <img  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeyO3uAn0XoIYGad6ZwF-yZB3KzLaSiHjofg&s' alt="CashFree" className="h-10 rounded-full bg-gray-500 " />
                        <p>CashFree</p>
                        </div>
                        <p className=' text-gray-500'>Payments are powered by CashFree</p>
                    </div>
                    <button
                        onClick={handlePayment}
                        className="w-full absolute bottom-0 right-0 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
