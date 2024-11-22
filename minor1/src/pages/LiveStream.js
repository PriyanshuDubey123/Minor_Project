import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaVideo, FaStop, FaShare, FaDesktop } from "react-icons/fa";
import HomeIcon from "@mui/icons-material/Home";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import axios from "axios";
import { Link } from "react-router-dom";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"], // Ensure compatibility with socket.io backend
  withCredentials: true, // Allow credentials for CORS
}); // Adjust backend URL

const LiveStream = () => {
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null); // To store the screen stream
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rtmpUrl, setRtmpUrl] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const validateRtmpUrl = (url) => {
    const regex = /^rtmp:\/\/[^\s]+$/;
    return regex.test(url);
  };

  const startStream = async () => {
    if (!validateRtmpUrl(rtmpUrl)) {
      toast.error("Please enter a valid RTMP URL.");
      return;
    }

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);

      socket.emit("start-stream", { rtmpUrl });

      const newMediaRecorder = new MediaRecorder(userStream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then((arrayBuffer) => {
            const uint8Array = new Uint8Array(arrayBuffer);
            socket.emit("stream-data", uint8Array);
          });
        }
      };

      newMediaRecorder.start(100);
      setMediaRecorder(newMediaRecorder);
      setIsStreaming(true);
      setIsModalOpen(false);
      toast.success("Live stream started!");
    } catch (err) {
      console.error("Error starting stream:", err);
      toast.error("Failed to start stream.");
    }
  };

  const stopStream = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }

    socket.emit("stop-stream");
    setIsStreaming(false);
    setIsScreenSharing(false);
    toast.info("Live stream stopped.");
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing and revert to webcam
      if (mediaRecorder) {
        mediaRecorder.stop();
        setMediaRecorder(null);
      }

      const newMediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then((arrayBuffer) => {
            const uint8Array = new Uint8Array(arrayBuffer);
            socket.emit("stream-data", uint8Array);
          });
        }
      };

      newMediaRecorder.start(100);
      setMediaRecorder(newMediaRecorder);
      setIsScreenSharing(false);
      toast.info("Screen sharing stopped.");
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
        });

        const [audioTrack] = stream.getAudioTracks();
        const combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          audioTrack,
        ]);

        const newMediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm;codecs=vp8,opus",
        });

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            event.data.arrayBuffer().then((arrayBuffer) => {
              const uint8Array = new Uint8Array(arrayBuffer);
              socket.emit("stream-data", uint8Array);
            });
          }
        };

        newMediaRecorder.start(100);
        setMediaRecorder(newMediaRecorder);
        setScreenStream(screenStream); // Store the screen stream
        setIsScreenSharing(true);
        toast.success("Screen sharing started!");
      } catch (err) {
        console.error("Error starting screen sharing:", err);
        toast.error("Failed to start screen sharing.");
      }
    }
  };



  const handleShareClick = () => {
    setIsModalOpen2(true);
  };

  // Close Modal
  const handleModalClose = () => {
    setIsModalOpen2(false);
  };

  const handleApiCall = async (liveUrl,title) => {
    try {
     
      const response = await axios.post('http://localhost:8080/api/livestream/share',{liveUrl,title});
      if (response.status === 200) {
        toast.success("Live URL shared successfully!");
      } else {
        toast.error("Failed to submit the live URL");
      }
    } catch (error) {
      console.error("Error submitting URL:", error);
      toast.error("Failed to submit the live URL");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 text-gray-800">
      <ToastContainer />

      {/* Header */}
      <header className="bg-black text-white py-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Title Section */}
        <div className="flex items-center space-x-3">
          <LiveTvIcon fontSize="large" className="text-white" />
          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              StudyMate Live Stream
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Engage with your audience in real-time.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-6">
          {/* Home Button */}
          <Link
            to="/admin"
            className="flex items-center space-x-2 bg-gray-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            <HomeIcon fontSize="medium" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </header>

      {/* Banner */}
      <section className="bg-gray-100 py-8 shadow-inner">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-semibold mb-4 text-black">
            Seamless Live Streaming Experience
          </h2>
          <p className="text-lg text-gray-500">
            Share knowledge, host events, or just connect with your audience effortlessly.
          </p>
        </div>
      </section>

      {/* Live Stream Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center">
          {/* Video or Screen Share Preview */}
          <div className="w-full max-w-3xl mb-8">
            {isScreenSharing && screenStream ? (
              <video
                autoPlay
                muted
                ref={(video) => {
                  if (video) video.srcObject = screenStream;
                }}
                className="w-full border-4 border-blue-500 rounded-lg shadow-lg"
              ></video>
            ) : stream ? (
              <video
                autoPlay
                muted
                ref={(video) => {
                  if (video) video.srcObject = stream;
                }}
                className="w-full border-4 border-blue-500 rounded-lg shadow-lg"
              ></video>
            ) : (
              <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg shadow-inner border-4 border-gray-300">
                <p className="text-gray-500 text-lg font-medium">
                  Video preview will appear here once you start streaming.
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex space-x-6">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isStreaming}
              className={`flex items-center space-x-2 px-8 py-4 text-lg font-semibold rounded shadow-lg transition-all ${
                isStreaming
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <FaVideo />
              <span>Start Live</span>
            </button>
            <button
              onClick={stopStream}
              disabled={!isStreaming}
              className={`flex items-center space-x-2 px-8 py-4 text-lg font-semibold rounded shadow-lg transition-all ${
                !isStreaming
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              <FaStop />
              <span>Stop Live</span>
            </button>
            {isStreaming && (
              <div>
              <button
                className="flex items-center space-x-2 px-8 py-4 text-lg font-semibold rounded shadow-lg transition-all bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleShareClick}
              >
                <FaShare />
                <span>Share</span>
              </button>
           
              {/* Modal Component */}
              {isModalOpen2 && (
                <Modal 
                  onClose={handleModalClose} 
                  onSubmit={(liveUrl,title) => {
                    // Call the API handler function here
                    handleApiCall(liveUrl,title);
                    setIsModalOpen2(false);
                  }} 
                />
              )}
            </div>
            )}
            {/* Screen Share Button - Only visible when streaming */}
            {isStreaming && (
              <button
                onClick={toggleScreenShare}
                className={`flex items-center space-x-2 px-8 py-4 text-lg font-semibold rounded shadow-lg transition-all ${
                  isScreenSharing
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                <FaDesktop />
                <span>{isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-105">
          <Dialog.Title className="text-2xl font-bold mb-6 text-blue-700">
            Enter RTMP URL
          </Dialog.Title>
          <input
            type="text"
            placeholder="rtmp://your-stream-url"
            value={rtmpUrl}
            onChange={(e) => setRtmpUrl(e.target.value)}
            className="border border-blue-400 px-4 py-3 w-full rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={startStream}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Start
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};



const Modal = ({ onClose, onSubmit }) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    onSubmit(url,title);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Enter Title</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md"
        />
        <h3 className="text-xl font-semibold mb-4">Enter Live Streaming URL</h3>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter live streaming URL"
          className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};


export default LiveStream;
