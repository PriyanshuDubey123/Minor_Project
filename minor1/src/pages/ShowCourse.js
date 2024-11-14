import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlay, FaTrash, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import VideoModal from '../utils/VideoModal';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';


function ShowCourse() {
  const params = useParams();
  const [courseData, setCourseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState([]);
  const id = params.id;

  const user = useSelector(selectUserInfo);
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/getcourse/${id}`);
        if(response.data.course.userId !== user.id){
          navigate('/home')
        }
        console.log(response.data.course);
        setCourseData(response.data.course);
        console.log(response.data.course);
        setEdit(response.data.course.underReview || response.data.course.isPublished);
        setShowDelete(!response.data.course.underReview && !response.data.course.isPublished);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [id,user]);

  const handleDeleteVideo = async (videoId) => {
    if (!videoId) {
      toast.error('Video ID not available. Please refresh the page and try again.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8080/api/courses/deletevideo/${id}/${videoId}`);
      console.log('Delete Response:', response.data);
      setCourseData((prevData) => ({
        ...prevData,
        videos: prevData.videos.filter((video) => video._id !== videoId),
      }));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete video');
    }
  };

  const handlePlayVideo = (videoUrl) => {
    console.log('Playing video:', videoUrl);  
    setSelectedVideoUrl(videoUrl);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setEdit(!edit);
    setShowDelete(!showDelete);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 p-6">
      <div className="lg:w-2/3 w-full">
        {courseData && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center">
              <img 
                src={courseData.thumbnailUrl} 
                alt="Course Thumbnail" 
                className="rounded-lg w-full object-contain"
                style={{ height: '200px' }}
              />
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-3xl font-bold text-blue-700 mb-2">{courseData.name}</h1>
              <p className="text-gray-600 mb-4">{courseData.description}</p>
              <div className="bg-gray-100 p-6 rounded-lg flex flex-col gap-2">
                <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Category:</span> {courseData.category}</p>
                <hr />
                <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Language:</span> {courseData.language}</p>
                <hr />
                <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Duration:</span> {courseData.duration} hours</p>
                <hr />
                <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Price:</span> {courseData.price > 0 ? <span className='bg-green-500 rounded-md text-white px-2'>₹{courseData.price}</span> : <span className='bg-green-500 rounded-md text-white px-2'>Free</span>}</p>
                <hr />
                <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Special:</span> {courseData.special}</p>
                <hr />
                <p className="text-sm text-gray-800 flex justify-between"><span className="font-semibold text-gray-900">Created At:</span> {new Date(courseData.createdAt).toLocaleDateString()}</p>
              </div>
              {courseData.videos && courseData.videos.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-blue-700 mb-2">Course Content</h2>
                  {edit && <button  className=" py-1 px-4 mb-4 rounded-lg shadow-md transition-colors duration-300" onClick={handleEdit}>
                    <img width={20} height={20} src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Pencil_edit_icon.jpg" alt="" /></button>}
                  <ul>
                    {courseData.videos.map((video) => (
                      <li key={video._id} className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded-md">
                        <div className="flex items-center">
                          <FaPlay className="text-blue-700 mr-2 cursor-pointer" onClick={() => handlePlayVideo(video.videoUrls)} />
                          <span className="text-gray-800">{video.title}</span>
                        </div>
                        <div>
                          <button
                            onClick={() => handlePlayVideo(video.videoUrls)}
                            className="text-blue-500 hover:text-blue-700 mr-4"
                          >
                            Play
                          </button>
                          {showDelete && <button
                            onClick={() => handleDeleteVideo(video._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {courseData?.underReview ? <UnderReview /> : courseData?.isPublished ? <Published /> :
        <div className="lg:w-1/3 w-full pl-0 lg:pl-4 mt-6 lg:mt-0">
          <UploadCourseForm courseData={courseData} courseId={id} setCourseData={setCourseData} />
        </div>}
      <Toaster position="top-right" />
      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoUrls={selectedVideoUrl} />
    </div>
  );
}

function UploadCourseForm({courseData, courseId, setCourseData }) {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleTitleChange = (event) => {
    setVideoTitle(event.target.value);
  };

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoTitle || !videoFile) {
      toast.error('Please provide both video title and file.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('video', videoFile);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/courses/upload/videos/${courseId}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          },
        }
      );

      console.log('Upload Response:', response.data);

      // Fetch the updated course data to ensure the video ID is available
      const updatedCourseResponse = await axios.get(`http://localhost:8080/api/courses/getcourse/${courseId}`);
      setCourseData(updatedCourseResponse.data.course);

      toast.success('Video uploaded and it is under processing');
      setIsUploading(false);
      setUploadProgress(0);
      setVideoTitle(''); // Clear the title input
      setVideoFile(null); // Clear the file input
      document.getElementById('videoFileInput').value = ''; // Clear the file input field in the DOM
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload video');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePublish = async () => {
    try {

      if(courseData.videos.length === 0){
      toast.error('Please upload the course content');
      return;}

      await axios.put(`http://localhost:8080/api/courses/review/${courseId}`);
      const updatedCourseResponse = await axios.get(`http://localhost:8080/api/courses/getcourse/${courseId}`);
      setCourseData(updatedCourseResponse.data.course);
      toast.success('Course is under Review!');
    } catch (err) {
      toast.error('Failed to publish course');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Upload Course Content</h2>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Video Title <span className='text-red-500'>*</span>
        </label>
        <input
          type="text"
          value={videoTitle}
          onChange={handleTitleChange}
          className="mb-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Video <span className='text-red-500'>*</span>
        </label>
        <input
          type="file"
          accept="video/*"
          id="videoFileInput"
          onChange={handleFileChange}
          className="mb-2 block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          required
        />
        {videoFile && (
          <>
            <button
              onClick={handleUpload}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-lg overflow-hidden mt-2">
                <div
                  className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-lg"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <button
        onClick={handlePublish}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 mt-4"
      >
        Publish Course
      </button>


      {courseData?.modification && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-md mt-4 flex items-start space-x-4">
    <FaExclamationTriangle className="text-yellow-500 text-3xl" />

    <div className="flex-1">
      <p className="text-yellow-800 font-bold">
        Warning: Course Needs Modification
      </p>
      <p className="text-yellow-700 mt-2">
        Your course has been flagged for modifications. Please ensure that it meets the required course policies. If your modification count reaches <span className="font-bold">3</span> and the course still does not comply, it will be permanently deleted.
      </p>
      <div className="flex items-center mt-3">
        <FaInfoCircle className="text-blue-500 mr-2" />
        <p className="text-blue-600 font-semibold">
          Current Modification Count: 
          <span className="text-blue-700 font-bold ml-1">
            {courseData.modificationCount}
          </span>
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function UnderReview() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center mb-2">
        <img 
          src="https://cdn.iconscout.com/icon/free/png-256/free-magnifying-glass-5136281-4285441.png?f=webp&w=256" 
          alt="Magnifying Glass" 
          className="w-10 h-10"
        />
      </div>
      <h2 className="text-2xl font-bold text-yellow-600 mb-2">Course Under Review</h2>
      <p className="text-gray-700">Your course is currently under review. You will be notified once the review process is complete.</p>
    </div>
  );
}

function Published() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center mb-2 animate-ping">
        <div className="bg-green-600 rounded-full p-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-green-600 mb-2">Course Published</h2>
      <p className="text-gray-700">Congratulations! Your course has been published and is now live.</p>
    </div>
  );
}

export default ShowCourse;
