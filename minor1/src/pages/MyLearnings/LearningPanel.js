import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { FaInstagram, FaLinkedin, FaTimes, FaTwitter, FaYoutube } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import 'tailwindcss/tailwind.css';
import { selectToggle } from '../../features/ToggleSlice';
import { useSelector } from 'react-redux';

const LearningPanel = () => {
  const location = useLocation();
  const { course } = location.state;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setModalIsOpen(false);
  };

  const socialIcons = {
    instagram: FaInstagram,
    youtube: FaYoutube,
    linkedin: FaLinkedin,
    twitter: FaTwitter
  };

  const isOpen = useSelector(selectToggle);

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 mt-20 ${isOpen ? 'w-[90vw]' : 'w-[75vw]'}`}>
      {/* Top Section */}
      <div className=" bg-gradient-to-t from-white to-blue-200 shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center mb-4">
            <div className=' flex flex-col justify-center items-center w-full '>

        <div className="h-52 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md  lg:aspect-none group-hover:opacity-75 flex justify-center">
        <img src={course.thumbnailUrl} alt={course?.name} className=" h-full rounded-md object-cover sm:mr-6 md:mr-6 lg:mr-6" />
         </div>          
          <div className="text-center sm:text-left mt-10  w-full flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-blue-700">{course?.name}</h1>
            <p className="text-gray-700 mt-2">{course.description}</p>
            <p className="text-gray-500 mt-1">{`By ${course?.creatorId?.name||'StudyMate'} (${course?.creatorId?.email || 'StudyMate.co'})`}</p>
            <div className="flex justify-center sm:justify-start mt-2">
              {Object.keys(socialIcons).map((key) => {
                  if (course.creatorId && course?.creatorId[key]) {
                      const Icon = socialIcons[key];
                      return (
                          <a href={course.creatorId[key]} target="_blank" rel="noopener noreferrer" key={key} className="text-gray-500 hover:text-blue-500 mx-2">
                      <Icon size={24} />
                    </a>
                  );
                }
                return null;
            })}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Course Contents</h2>
          <div className="h-2 bg-gray-200 rounded-full mt-2">
            <div className="h-2 bg-blue-600 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
        <ul className="space-y-4">
          {course.videos.map((video, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                  <img src={course.thumbnailUrl} alt={`Thumbnail for ${video.title}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                </div>
              </div>
              <button onClick={() => openModal(video.videoUrl)} className="text-blue-600 hover:text-blue-800">
                Play
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Video Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="flex items-center justify-center mt-10">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[999]">
          <div className="bg-white rounded-lg p-6 max-w-full w-full md:max-w-3xl relative left-16 top-5">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 z-50">
              <FaTimes size={20} />
            </button>
            <div className="flex justify-center">
              <ReactPlayer
                url={`http://localhost:8080/video?videoUrl=${encodeURIComponent(selectedVideo)}`}
                controls
                width="100%"
                height="60vh"
                style={{ maxHeight: '60vh' }}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LearningPanel;
