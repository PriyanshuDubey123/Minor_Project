import React from 'react';
import { useSelector } from 'react-redux';
import { selectToggle } from '../features/ToggleSlice';

function ContactUs() {

const toggle = useSelector(selectToggle);

  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-tr from-white to-blue-200 min-h-screen p-10 my-10 ${toggle?'w-[91vw] ':null}`}>
      <div className="  shadow-lg p-8 w-full  text-center bg-white flex justify-center items-center flex-col mt-10 ">
       <img height={200} width={200} className=' rounded-lg' src="https://doi-ds.org/images/upload/contact_us.jpg" alt="" />
        <p className="text-lg text-gray-700 mb-4">
          We're here to help! If you have any questions or need further assistance, please don't hesitate to reach out.
        </p>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">Email Us</h2>
          <p className="text-gray-700">help.studymate@gmail.com</p>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">Visit Us</h2>
          <p className="text-gray-700">Bhopal, Madhya Pradesh</p>
        </div>
        <p className="text-lg text-gray-700">
          For any queries, contact us at our email address.
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
