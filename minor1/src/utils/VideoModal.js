import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { FaTimes, FaCog } from 'react-icons/fa';

const VideoModal = ({ isOpen, onClose, videoUrls }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState('auto');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (isOpen && !playerRef.current) {
      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        aspectRatio: '16:9',
        sources: [{ src: getVideoUrl('auto'), type: 'application/x-mpegURL' }],
      });
    }

    if (playerRef.current && isOpen) {
      playerRef.current.src({ src: getVideoUrl(currentResolution), type: 'application/x-mpegURL' });
      playerRef.current.play();
    }

    return () => {
      if (playerRef.current && !isOpen) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isOpen, currentResolution]);

  const getVideoUrl = (resolution) => {
    const videoUrlObj = videoUrls.find(video =>
      resolution === 'auto' ? video.resolution === 'master' : video.resolution === resolution
    );
    return videoUrlObj ? videoUrlObj.url : videoUrls[0]?.url;
  };

  const handleResolutionChange = (event) => {
    setCurrentResolution(event.target.value);
    setIsSettingsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 mt-5">
      {/* Main Container */}
      <div className="bg-white rounded-lg p-6 px-8 relative shadow-lg w-full max-w-4xl flex flex-col">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-900 z-20 p-2"
        >
          <FaTimes size={24} />
        </button>

        {/* Video Player Container */}
        <div className="flex justify-center mb-4 w-full relative flex-grow ">
          <div className="w-full h-auto relative" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
            {/* Watermark */}
            <div
              className="absolute top-4 right-4 bg-transparent text-white text-xl italic font-semibold z-10 pointer-events-none"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                opacity: 0.7
              }}
            >
              StudyMate
            </div>

            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered absolute top-0 left-0 w-full h-full object-contain"
              controls
              preload="auto"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Settings Icon and Dropdown */}
        <div className="absolute bottom-1 left-4 flex items-center space-x-4 z-20">
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
    </div>
  );
};

export default VideoModal;