import React from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>
        <div className="flex justify-center">
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full rounded-lg" 
            style={{ maxHeight: '75vh' }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
