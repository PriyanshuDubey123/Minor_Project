import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { selectUserInfo } from '../../features/user/userSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './CreatorNavbar';
import { format, subMonths } from 'date-fns';




const CreatorAccount = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedCourseTab, setSelectedCourseTab] = useState('published');
  const [filters, setFilters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const user = useSelector(selectUserInfo);
  const graphRef = useRef(null);
  const coursesRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/creator/get/creator/courses/${user.id}`, {
          params: { filters, month: selectedMonth }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user.id, filters, selectedMonth]);

  const renderShimmerEffect = () => (
    <div className="p-10">
      <Skeleton height={50} width={200} />
      <Skeleton height={300} className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Skeleton height={200} />
        <Skeleton height={200} />
      </div>
      <Skeleton height={50} width={200} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill().map((_, i) => (
          <Skeleton key={i} height={350} />
        ))}
      </div>
    </div>
  );

  const { publishedCourses, underReviewCourses, pendingCourses, totalSales, totalRevenue, sales, revenue } = data || {};

  const handleTabSelect = (tab) => {
    if (tab === 'dashboard' && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'analytics' && graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'my-courses' && coursesRef.current) {
      coursesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterSelect = (filter) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const handleFilterRemove = (filter) => {
    setFilters(filters.filter(f => f !== filter));
    setDropdownOpen(false);
  };

  const handleClearFilters = () => {
    setFilters([]);
    setDropdownOpen(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const displayedCourses = selectedCourseTab === 'published' ? publishedCourses : selectedCourseTab === 'pending' ? pendingCourses : underReviewCourses;

  return (
    <>
      <Navbar onTabSelect={handleTabSelect} />
      <div ref={topRef} className="p-10 bg-gray-100 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <Link to={'/creator-account/add-course'}>
            <button className="flex justify-center items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Launch a New Course <span className='text-3xl ml-2'>+</span>
            </button>
          </Link>
        </div>

        {loading ? renderShimmerEffect() : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md w-full flex items-center">
                <img src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-3/3/75-512.png" alt="Total Revenue" className="w-12 h-12 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
                  <p className="text-2xl font-bold">{totalSales}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md w-full flex items-center">
                <img src="https://cdn-icons-png.freepik.com/512/4720/4720176.png" alt="Total Sales" className="w-12 h-12 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
                  <p className="text-2xl font-bold">₹{totalRevenue}</p>
                </div>
              </div>
            </div>

            <div ref={graphRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Sales and Revenue Chart</h2>
               <div className="mb-4">
                <label htmlFor="month" className="block text-gray-700 font-semibold mb-2">Select Month</label>
                <input
                  type="month"
                  id="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Total Sales', value: sales },
                    { name: 'Total Revenue', value: revenue },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div ref={coursesRef} className="mb-6">
              <div className="flex justify-center mb-4 gap-5">
                <button
                  onClick={() => setSelectedCourseTab('published')}
                  className={`px-4 py-2 rounded-t-lg ${selectedCourseTab === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  Published Courses
                </button>
                <button
                  onClick={() => setSelectedCourseTab('under-review')}
                  className={`px-4 py-2 rounded-t-lg ${selectedCourseTab === 'under-review' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  Under Review Courses
                </button>
                <button
                  onClick={() => setSelectedCourseTab('pending')}
                  className={`px-4 py-2 rounded-t-lg ${selectedCourseTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  Pending Courses
                </button>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {filters.map(filter => (
                  <div key={filter} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <span>{filter}</span>
                    <button onClick={() => handleFilterRemove(filter)}>✕</button>
                  </div>
                ))}

                {filters.length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {displayedCourses?.length > 0 && (
                <>
                  <div className="relative mb-6">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="px-4 py-2 rounded-t-lg bg-blue-500 text-white  hover:bg-blue-600 transition"
                    >
                      Filters
                    </button>
                    {dropdownOpen && (
                      <div className="absolute z-10 bg-white shadow-md rounded-lg mt-2 py-2 w-64">
                        {['Free', 'Price > 1000', 'Price > 5000', 'Price < 500', 'Price < 1000', 'Most Popular', 'Most Profitable', 'Latest'].map(filter => (
                          <button
                            key={filter}
                            onClick={() => handleFilterSelect(filter)}
                            className={`block px-4 py-2 text-left w-full ${filters.includes(filter) ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'}`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCourses?.length === 0 ? (
                  <p className="col-span-full text-center">No courses to display.</p>
                ) : (
                  displayedCourses?.map(course => (
                    <div key={course._id} className="relative bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <Link to={`/course/${course._id}`}>
                        <img width={25} height={25} className='absolute -right-3 top-4' src='https://cdn-icons-png.freepik.com/512/5690/5690084.png'/>
                      </Link>
                      <div className="flex justify-center">
                        <img 
                          src={course.thumbnailUrl} 
                          alt="Course Thumbnail" 
                          className="rounded-lg w-full object-contain"
                          style={{ height: '200px' }}
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h1 className="text-3xl font-bold text-blue-700 mb-2">{course.name}</h1>
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        <div className="bg-gray-100 p-6 rounded-lg flex flex-col gap-2">
                          <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Category:</span> {course.category}</p>
                          <hr />
                          <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Language:</span> {course.language}</p>
                          <hr />
                          <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Duration:</span> {course.duration} hours</p>
                          <hr />
                          <p className="text-sm text-gray-800 flex justify-between">
                            <span className="font-semibold text-gray-900">Price:</span> 
                            {course.price > 0 ? (
                              <span className='bg-green-500 rounded-md text-white px-2'>₹{course.price}</span>
                            ) : (
                              <span className='bg-green-500 rounded-md text-white px-2'>Free</span>
                            )}
                          </p>
                          <hr />
                          <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Special:</span> {course.special}</p>
                          <hr />
                          <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Created At:</span> {new Date(course.createdAt).toLocaleDateString()}</p>
                          <hr />
                          <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Number of Videos:</span> {course.videos.length}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreatorAccount;
