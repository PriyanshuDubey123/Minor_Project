import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoData }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState('auto');

  useEffect(() => {
    if (playerRef.current) {
      // Dispose the existing player if it exists
      playerRef.current.dispose();
    }

    // Initialize Video.js
    const videoElement = videoRef.current;
    playerRef.current = videojs(videoElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      sources: [
        {
          src: getVideoUrl(currentResolution),
          type: 'application/x-mpegURL', // HLS
        },
      ],
    });

    // Cleanup on component unmount
    return () => {
      playerRef.current.dispose();
    };
  }, [currentResolution, videoData]);

  const getVideoUrl = (resolution) => {
    const videoUrlObj = videoData.videoUrls.find(video => video.resolution === resolution);
    return videoUrlObj ? videoUrlObj.url : '';
  };

  const handleResolutionChange = (event) => {
    const selectedResolution = event.target.value;
    setCurrentResolution(selectedResolution);
  };

  return (
    <div className="video-player">
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          controls
          preload="auto"
          data-setup="{}"
        />
      </div>
      <div className="resolution-selector mt-2">
        <label htmlFor="resolution" className="mr-2">Select Resolution:</label>
        <select id="resolution" value={currentResolution} onChange={handleResolutionChange}>
          <option value="auto">Auto</option>
          <option value="360p">360p</option>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="master">Master</option>
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;
