import axios from "axios";
import React, { useState, useEffect } from "react";
import { selectToggle } from "../features/ToggleSlice";
import { useSelector } from "react-redux";

const LiveClass = () => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);

  // Fetch live streams from the backend
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/livestream/getliveclasses');
        if (response.data.liveClasses.length === 0) {
          setStreams([]); // No classes available
        } else {
          setStreams(response.data.liveClasses);
        }
      } catch (error) {
        console.error("Error fetching live classes", error);
      }
    };
    fetchStreams();
  }, []);

  const selecttoggle = useSelector(selectToggle)

  return (
    <div className={` mt-16 bg-gray-100 min-h-screen p-6 ${!selecttoggle ? "w-[calc(100vw-20.6rem)]" : "w-[calc(100vw-6.4rem)]"}`}>
      {/* Video Player */}
      <div className="bg-black rounded-lg shadow-lg overflow-hidden mb-6">
        {selectedStream ? (
          <iframe
            src={`https://www.youtube.com/embed/${selectedStream.url}`}
            title={selectedStream.title}
            className="w-full h-96"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : streams.length === 0 ? (
          <div className="flex items-center justify-center text-black h-40 bg-gradient-to-r from-gray-200 to-gray-300">
            <p className="text-lg font-semibold">No live classes available.</p>
          </div>
        ) : (
          <div className="flex items-center justify-center text-white h-40 bg-gradient-to-r from-gray-600 to-gray-800">
            <p className="text-lg font-semibold">No live class is selected. Please select a live class from available classes.</p>
          </div>
        )}
      </div>

      {/* Stream Cards */}
      {streams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <div
              key={stream._id}
              className={`p-4 bg-white shadow-lg rounded-lg cursor-pointer border ${
                selectedStream?._id === stream._id ? "border-blue-600" : "border-transparent"
              } hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105`}
              onClick={() => setSelectedStream(stream)}
            >
              <img
                src="https://i.pinimg.com/736x/f2/d6/7d/f2d67d8b0b75a420095546ab6036614d.jpg"
                alt={stream.title}
                className="rounded-lg w-full h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-bold text-gray-700 mb-2">{stream.title}</h3>
              <p className="text-gray-500 text-sm">Live Class from Admin</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LiveClass;
