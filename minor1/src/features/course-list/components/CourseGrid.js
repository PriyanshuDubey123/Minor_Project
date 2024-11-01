import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Tooltip from '@mui/material/Tooltip';
import { StarIcon } from '@heroicons/react/20/solid';
import { discountedPrice } from '../../../app/constants';
import { selectToggle } from '../../ToggleSlice';

function CourseGrid({ courses }) {
  const isOpen = useSelector(selectToggle);

  const shareOnWhatsApp = (courseLink) => {
    const message = `Check out this course: ${courseLink}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="lg:col-span-3">
      <div className="p-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-${isOpen ? 3 : 2}`}>
            {courses &&
              courses.map((course) => (
                <div
                  key={course._id}
                  className="relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Link to={`/course-detail/${course._id}`}>
                    <div className="flex flex-col h-full">
                      {/* Image Section with Overlay */}
                      <div className="relative overflow-hidden">
                        <div className="min-h-72 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-72">
                          <img src={course.thumbnailUrl} alt={course?.name} className="h-full w-full " />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                        <div className="absolute bottom-2 left-2 text-white font-semibold bg-purple-600 bg-opacity-80 rounded px-2 py-1 text-xs">
                          10% Off
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-grow space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-600">For {course.category} 2024 students</p>

                        {/* Rating and Price */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <StarIcon className="w-5 h-5" />
                            <span className="text-sm">No rating yet</span>
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <p className="text-lg font-bold text-blue-600">
                              {course.price !== 0 ? '₹' : ''} {course.price !== 0 ? discountedPrice(course) : 'Free'}
                            </p>
                            {course.price !== 0 && (
                              <p className="text-sm line-through text-gray-500">₹{course.price}</p>
                            )}
                          </div>
                        </div>

                        {/* New and WhatsApp Share */}
                        <div className="flex items-center justify-between mt-3">
                          <button className="bg-yellow-300 text-xs font-bold text-gray-800 px-2 py-1 rounded">
                            New
                          </button>
                          <Tooltip title="Share on WhatsApp" arrow>
                            <div onClick={() => shareOnWhatsApp(`http://localhost:3000/course-detail/${course._id}`)} className="cursor-pointer transition-transform transform hover:scale-110">
                              <WhatsAppIcon className="text-green-500 w-6 h-6" />
                            </div>
                          </Tooltip>
                        </div>

                        {/* See Details Button */}
                        <button className="mt-5 bg-purple-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300">
                          See Details
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* Expiration Notice */}
                  {course.deleted && (
                    <div className="absolute inset-0 bg-red-700 bg-opacity-80 flex items-center justify-center">
                      <p className="text-white font-bold">Course Expired</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseGrid;
