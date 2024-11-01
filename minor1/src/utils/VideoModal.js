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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl relative shadow-lg">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 z-20"
        >
          <FaTimes size={24} />
        </button>
        
        <div className="flex justify-center mb-4">
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered w-full h-72 rounded-lg"
            controls
            preload="auto"
            style={{ maxWidth: '100%', height: 'auto' }} // Responsive sizing for fullscreen
          />
        </div>

        <div className="flex justify-between items-center mt-2 px-2">
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
              className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition duration-200 flex items-center z-20"
            >
              <FaCog size={20} />
            </button>
            {isSettingsOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-36 bg-white shadow-lg rounded-lg z-30">
                <label className="block text-gray-700 p-2">
                  <span className="text-sm font-medium">Quality</span>
                  <select 
                    value={currentResolution} 
                    onChange={handleResolutionChange} 
                    className="w-full bg-gray-100 border rounded-lg p-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="auto">Auto (Best Quality)</option>
                    <option value="360p">360p</option>
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
