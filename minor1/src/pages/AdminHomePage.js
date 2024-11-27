import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminLoginInfo } from '../features/admin/components/AdminAuthSlice';
import { fetchAllCoursesAsync, selectAllCourses } from '../features/course-list/CourseSlice';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { replace } from 'formik';
import { FaEllipsisV, FaTrash, FaCheckCircle, FaCog } from 'react-icons/fa'; // Import icons
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import VideoModal from '../utils/VideoModal';
import videojs from 'video.js';


function AdminHomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCoursesAsync());
  }, [dispatch]);

  const courses = useSelector(selectAllCourses);
  const admin = useSelector(selectAdminLoginInfo);
  console.log(admin)
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 20;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState({}); // State to track which course menu is open

  const filteredCourses = courses.filter((course) => {
    if (filter === 'published') {
      return course.isPublished;
    } else if (filter === 'underReview') {
      return course.underReview;
    }
    return true;
  });

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePlayVideo = (course, index) => {
    setCurrentCourse(course);
    setCurrentVideoIndex(index);
    setCurrentVideo(course.videos[index].videoUrls);
  };

  const handleNextVideo = () => {
    if (currentCourse && currentVideoIndex < currentCourse.videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setCurrentVideo(currentCourse.videos[nextIndex].videoUrls);

    }
  };

  const handlePreviousVideo = () => {
    if (currentCourse && currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setCurrentVideo(currentCourse.videos[prevIndex].videoUrls);

    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentVideo(null);
    setCurrentCourse(null);
    setCurrentPage(1); // Reset to the first page when changing filters
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSignOut = () => {
    // Implement your sign out logic here
    navigate('/logout?admin=true');
    setIsDropdownOpen(false); // Close dropdown after sign out
  };

  // New API Call Handlers
  const handleDeleteCourse = async(course) => {
    try {
      
  
      const response = await axios.put(`http://localhost:8080/api/courses/modify/${course._id}`);
      
      if (response.status === 200) {
        toast.success("Course deleted successfully");
        setCurrentVideo(null);
        dispatch(fetchAllCoursesAsync());
        await axios.post("http://localhost:8080/api/notifications/post",{userID:course.userId,data:{content:`Your Course '${course?.name}' has been disapproved by admin`,type:"Real Time Notification"}})
      } else {
        toast.error('Failed to delete the course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('There was an error deleting the course. Please try again later.');
    }
  };

  const handlePublishCourse = async(course) => {
    try {
      
      const response = await axios.put(`http://localhost:8080/api/courses/publish/${course._id}`);
      
      if (response.status === 200) {
        toast.success("Course published successfully");
        setCurrentVideo(null);
        dispatch(fetchAllCoursesAsync());
        await axios.post("http://localhost:8080/api/notifications/post",{userID:course.userId,data:{content:`Your Course '${course?.name}' has been published by admin`,type:"Real Time Notification"}})
      } else {
        toast.error('Failed to publish the course');
      }
    } catch (error) {
      console.error('Error publish course:', error);
      alert('There was an error publishing the course. Please try again later.');
    }
  };

  // Toggle menu visibility
  const toggleMenu = (courseId) => {
    setIsMenuOpen((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };



  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState('auto');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (currentVideo && !playerRef.current) {
      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        aspectRatio: '16:9',
        sources: [{ src: getVideoUrl('auto'), type: 'application/x-mpegURL' }],
      });
    }

    if (playerRef.current && currentVideo) {
      playerRef.current.src({ src: getVideoUrl(currentResolution), type: 'application/x-mpegURL' });
      playerRef.current.play();
    }

    return () => {
      if (playerRef.current && !currentVideo) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [currentVideo, currentResolution]);

  const getVideoUrl = (resolution) => {
    const videoUrlObj = currentVideo.find(video =>
      resolution === 'auto' ? video.resolution === 'master' : video.resolution === resolution
    );
    return videoUrlObj ? videoUrlObj.url : currentVideo[0]?.url;
  };

  const handleResolutionChange = (event) => {
    setCurrentResolution(event.target.value);
    setIsSettingsOpen(false);
  };

  return (
    <>
      {!admin && <Navigate to={'/adminlogin'} replace={true}></Navigate>}
      <Toaster />
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 backdrop-blur-sm">
        {/* Navbar */}
        <nav className="bg-black text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-4">
        <img 
          src="https://i.pinimg.com/736x/f2/d6/7d/f2d67d8b0b75a420095546ab6036614d.jpg" 
          alt="Logo" 
          className="h-10" 
        />
        <h1 className="text-2xl font-extrabold">Admin Panel</h1>
      </div>
      <div className="relative flex items-center space-x-4">
        {/* Live Streaming Icon */}
        <Link to="/admin/livestream">
        <SettingsInputAntennaIcon 
            className="text-black bg-white cursor-pointer hover:text-gray-700 rounded-full border-2 border-white p-2 transition-transform duration-200 hover:scale-110"
            fontSize="large"
            titleAccess="Live Streaming"
          />
        </Link>
        {/* Profile Photo */}
        <img 
          src="https://t4.ftcdn.net/jpg/03/08/33/75/360_F_308337583_CahQnaQMDdhkNnAY7Q0k7dhZZFCEmj7p.jpg" 
          alt="Profile" 
          className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
        />
        <span 
          className="font-semibold cursor-pointer" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
        >
          {admin?.name}
        </span>
        {/* Sign Out Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 bg-white shadow-lg rounded-md mt-1 top-12 px-5 z-10">
            <button 
              onClick={handleSignOut} 
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-28 text-left"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>

        {/* Filter Section */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            All Courses
          </button>
          <button
            onClick={() => handleFilterChange('published')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'published' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Published Courses
          </button>
          <button
            onClick={() => handleFilterChange('underReview')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'underReview' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Under Review
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden mt-10 transition-all">
          {/* Course List */}
          <div className={`${currentVideo ? 'w-full lg:w-1/3' : 'w-full'} transition-all duration-300 h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-200`}>
            <div className={`${currentVideo ? 'flex flex-col space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {(currentCourses && currentCourses.length>0) ? currentCourses.map((course) => (
                <div
                  key={course._id}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 w-full sm:w-72 md:w-80 lg:w-96 ${currentCourse?._id === course._id ? 'border-4 border-purple-500' : ''}`}
                >
                  {/* Thumbnail Section */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                    <div className="min-h-72 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-72">
                  <img src={course.thumbnailUrl} alt={course?.name} className="h-full w-full" />
                </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h2 className="text-xl font-bold drop-shadow-md">{course.name}</h2>
                      {currentCourse?._id === course._id && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="text-sm font-bold">Playing</span>
                        </div>
                      )}
                    </div>
                    {/* Three Dots Menu */}
                    {course.underReview && (
                      <div className="absolute top-2 right-2">
                        <button onClick={() => toggleMenu(course._id)}>
                          <FaEllipsisV className="text-white cursor-pointer" />
                        </button>
                        {isMenuOpen[course._id] && (
                         <div className="absolute right-0 bg-white shadow-xl rounded-lg mt-1 p-3 z-20 border border-gray-300">
                         <button
                           onClick={() => handleDeleteCourse(course)}
                           className="flex items-center text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors duration-200 ease-in-out"
                         >
                           <FaTrash className="mr-2 text-lg" />
                           <span className="font-semibold">Delete Course</span>
                         </button>
                         <button
                           onClick={() => handlePublishCourse(course)}
                           className="flex items-center text-green-600 hover:bg-green-100 p-2 rounded-lg transition-colors duration-200 ease-in-out mt-2"
                         >
                           <FaCheckCircle className="mr-2 text-lg" />
                           <span className="font-semibold">Publish Course</span>
                         </button>
                       </div>
                       
                        )}
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="p-5 space-y-4">
                    <p className="text-gray-700 line-clamp-2">{course.description}</p>
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <p className="text-gray-900 font-semibold">
                        <strong>Duration:</strong> <span className="text-blue-500">{course.duration} hours</span>
                      </p>
                      <p className="text-gray-900 font-semibold">
                        <strong>Price:</strong> <span className="text-green-500">{course.price>0?`₹${course.price}`:"FREE"}</span>
                      </p>
                      <p className="text-gray-900 font-semibold">
                        <strong>Language:</strong> <span className="text-indigo-500">{course.language}</span>
                      </p>
                      <p className="text-gray-900 font-semibold">
                        <strong>Category:</strong> <span className="text-indigo-500">{course.category}</span>
                      </p>
                      <p className="text-gray-900 font-semibold">
                        <strong>Videos:</strong> <span className="text-indigo-500">{course.videos.length}</span>
                      </p>
                    </div>
                    {course.videos.length > 0 ? (
                      <button
                        className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
                        onClick={() => handlePlayVideo(course, 0)}
                        disabled={currentVideo && currentCourse?._id === course._id}
                      >
                        {currentVideo && currentCourse?._id === course._id ? 'Playing' : 'Play Course'}
                      </button>
                    ) : (
                      <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed" disabled>
                        No content available
                      </button>
                    )}
                  </div>
                </div>
              )):<p className='w-[98vw] text-gray-500 font-semibold text-center'>No Courses Found</p>}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Video Player Section */}
          {currentVideo && (
            <div className="w-full lg:w-2/3 bg-gray-900 p-4 rounded-md flex flex-col items-center justify-center space-y-4 overflow-y-auto">
             
             <div className="flex justify-center w-full relative flex-grow ">
          <div className="w-full h-auto relative" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered absolute top-0 left-0 w-full h-full object-contain"
              controls
              preload="auto"
              style={{ objectFit: 'contain' }}
            />
          </div>
         

          <div className="absolute bottom-8 left-1 flex items-center space-x-4 z-20">
  {/* Settings Button */}
  <button 
    onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
    className="p-1 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
  >
    <FaCog size={22} />
  </button>

  {/* Settings Dropdown */}
  {isSettingsOpen && (
  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white shadow-2xl rounded-lg z-30 transform scale-100 transition-all duration-300 ease-in-out opacity-90">
    <div className="p-3">
      <label className="block text-gray-800 text-sm font-medium mb-2">Quality</label>
      <select 
        value={currentResolution} 
        onChange={handleResolutionChange} 
        className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-300 ease-in-out"
      >
        <option value="auto">Auto</option>
        <option value="360p">360p</option>
        <option value="480p">480p</option>
        <option value="720p">720p</option>
      </select>
    </div>
  </div>
)}

</div>

        </div>

        


              <div className="flex justify-between w-full px-4">
                <button
                  onClick={handlePreviousVideo}
                  className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg transition-all ${currentVideoIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  disabled={currentVideoIndex === 0}
                >
                  Previous Video
                </button>
                <p className="text-white text-lg">{currentVideo.title}</p>
                <button
                  onClick={handleNextVideo}
                  className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg transition-all ${currentCourse && currentVideoIndex === currentCourse.videos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  disabled={currentCourse && currentVideoIndex === currentCourse.videos.length - 1}
                >
                  Next Video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHomePage;
