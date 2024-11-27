import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaTimes, FaTwitter, FaYoutube, FaStar } from 'react-icons/fa';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import 'tailwindcss/tailwind.css';
import { selectToggle } from '../../features/ToggleSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import VideoModal from '../../utils/VideoModal';
import { selectUserInfo } from '../../features/user/userSlice';
import toast, { Toaster } from 'react-hot-toast';

const LearningPanel = () => {


  const user = useSelector(selectUserInfo);

  const location = useLocation();
  const initialCourse = location.state.course;
  
  const [course, setCourse] = useState(initialCourse);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [ratingModalIsOpen, setRatingModalIsOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const openModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setModalIsOpen(false);
  };

  const openRatingModal = () => {
    setRatingModalIsOpen(true);
  };

  const closeRatingModal = () => {
    setUserRating(0);
    setRatingModalIsOpen(false);
  };

  const submitRating = async () => {
    try {
     const response = await axios.post('http://localhost:8080/api/courses/rate-the-course', {
        userId: user.id,  
        courseId: course._id,
        rating: userRating,
      });
      setCourse((prev)=>({...prev,overAllRating:response.data.overAllRating}));
      toast.success('Thank you for your rating!');
      closeRatingModal();
    } catch (error) {
      toast.error('You have already rated this course.');
    }
  };

  const socialIcons = {
    instagram: FaInstagram,
    youtube: FaYoutube,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
  };

  const isOpen = useSelector(selectToggle);

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 mt-20 ${isOpen ? 'w-[90vw]' : 'w-[75vw]'}`}>
      <Toaster/>
      {/* Top Section */}
      <div className="bg-gradient-to-t from-white to-blue-200 shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center mb-4">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="h-52 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 flex justify-center">
              <img
                src={course.thumbnailUrl}
                alt={course?.name}
                className="h-full rounded-md object-cover sm:mr-6 md:mr-6 lg:mr-6"
              />
            </div>
            <div className="text-center sm:text-left mt-10 w-full flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold text-blue-700">{course?.name}</h1>
              <p className="text-gray-700 mt-2">{course.description}</p>
              <p className="text-gray-500 mt-1">{`By ${course?.creatorId?.name || 'StudyMate'} (${course?.creatorId?.email || 'StudyMate.co'})`}</p>
              <div className="flex justify-center sm:justify-start mt-2">
                {Object.keys(socialIcons).map((key) => {
                  if (course.creatorId && course?.creatorId[key]) {
                    const Icon = socialIcons[key];
                    return (
                      <a
                        href={course.creatorId[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={key}
                        className="text-gray-500 hover:text-blue-500 mx-2"
                      >
                        <Icon size={24} />
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
              {/* Rating Section */}
              <div className="mt-4 flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar
                      key={i}
                      size={24}
                      color={i < course.overAllRating ? '#ffc107' : '#d1d5db'}
                    />
                  ))}
                <button
                  onClick={openRatingModal}
                  className="text-blue-600 hover:text-blue-800 ml-4"
                >
                  Rate this course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Course Contents</h2>
          <div className="h-1 bg-blue-600 rounded-full mt-2"></div>
        </div>
        <ul className="space-y-4">
          {course.videos.map((video, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                  <img
                    src={course.thumbnailUrl}
                    alt={`Thumbnail for ${video.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                </div>
              </div>
              <button onClick={() => openModal(video.videoUrls)} className="text-blue-600 hover:text-blue-800">
                Play
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Video Modal */}
      <VideoModal isOpen={modalIsOpen} onClose={closeModal} videoUrls={selectedVideo} />

      {/* Rating Modal */}
      <Modal
  isOpen={ratingModalIsOpen}
  onRequestClose={closeRatingModal}
  className="relative bg-white rounded-lg p-6 w-full max-w-md mx-auto z-[1000]"
  overlayClassName="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center"
>
  <div>
    <h2 className="text-2xl font-semibold mb-4 text-center">Rate This Course</h2>
    <div className="flex justify-center mb-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <FaStar
            key={i}
            size={36}
            color={i < userRating ? '#ffc107' : '#e4e5e9'}
            onClick={() => setUserRating(i + 1)}
            className="cursor-pointer"
          />
        ))}
    </div>
    <div className="flex justify-center">
      <button
        onClick={submitRating}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
      >
        Submit
      </button>
      <button
        onClick={closeRatingModal}
        className="px-4 py-2 bg-gray-300 text-black rounded ml-2 hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default LearningPanel;
