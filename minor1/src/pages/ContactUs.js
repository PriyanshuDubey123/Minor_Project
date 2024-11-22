import React from 'react';
import { useSelector } from 'react-redux';
import { selectToggle } from '../features/ToggleSlice';

function ContactUs() {
  const toggle = useSelector(selectToggle);

  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-tr from-gray-100 to-gray-200 min-h-screen p-10 ${!toggle ? "w-[calc(100vw-20.6rem)]" : "w-[calc(100vw-6.4rem)]"}`}>
      <div className="shadow-lg p-8 w-full max-w-4xl text-center bg-white flex justify-center items-center flex-col mt-10 rounded-lg border border-gray-200">
        
        {/* Image Section */}
        <img
          height={200}
          width={200}
          className="rounded-lg shadow-xl mb-6"
          src="https://doi-ds.org/images/upload/contact_us.jpg"
          alt="Contact Us"
        />
        
        {/* Heading and description */}
        <h1 className="text-3xl font-extrabold text-purple-600 mb-6">We're here to help!</h1>
        <p className="text-lg text-gray-700 mb-6">
          If you have any questions or need further assistance, please don't hesitate to reach out.
        </p>
        
        {/* Email Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">Email Us</h2>
          <p className="text-gray-700 hover:text-purple-600 transition duration-300">
            <a href="mailto:help.studymate@gmail.com">help.studymate@gmail.com</a>
          </p>
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">Visit Us</h2>
          <p className="text-gray-700">Bhopal, Madhya Pradesh</p>
        </div>

        {/* Footer Message */}
        <p className="text-lg text-gray-700">
          For any queries, contact us at our email address.
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
