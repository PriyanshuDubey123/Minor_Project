import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToggle } from "../../ToggleSlice";
import axios from "axios";
import { selectUserInfo } from "../userSlice";
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa"; // Importing social media icons
import Skeleton from "react-loading-skeleton"; // Importing skeleton loading effect
import 'react-loading-skeleton/dist/skeleton.css';

export default function UserProfile() {
  const user = useSelector(selectUserInfo);
  const isOpen = useSelector(selectToggle);

  // Local state for user data
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profilePicture: '',
    purchasedCourses: [],
    bio: '',
    instagram: '',
    youtube: '',
    linkedIn: '',
    twitter: '',
    isCreator: false,
  });

  const [loading, setLoading] = useState(true); // Loading state
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [newProfileData, setNewProfileData] = useState({ // Local state for new profile data
    username: '',
    email: '',
    profilePicture: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Submitting state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/profile/${user?.id}`);
        setProfileData({
          username: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s',
          purchasedCourses: response.data.purchasedCourses || [],
          bio: response.data.bio || '',
          instagram: response.data.instagram || '',
          youtube: response.data.youtube || '',
          linkedIn: response.data.linkedin || '',
          twitter: response.data.twitter || '',
          isCreator: response.data.isCreator,
        });
        setNewProfileData({
          username: response.data.name,
          email: response.data.email,
          profilePicture: null,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [user?.id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setNewProfileData({ ...newProfileData, profilePicture: files[0] });
    } else {
      setNewProfileData({ ...newProfileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', newProfileData.username);
    formData.append('email', newProfileData.email);
    if (newProfileData.profilePicture) {
      formData.append('profilePicture', newProfileData.profilePicture);
    }

    try {
      await axios.put(`http://localhost:8080/users/update/profile/${user?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData(prevData => ({
        ...prevData,
        username: newProfileData.username,
        email: newProfileData.email,
        profilePicture: newProfileData.profilePicture ? URL.createObjectURL(newProfileData.profilePicture) : prevData.profilePicture,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 mt-20 ${isOpen ? 'w-[90vw]' : 'w-[75vw]'}`}>
      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <img
            src={profileData.profilePicture}
           
            className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
          />
          <div className="text-left space-y-1">
            {loading ? (
              <Skeleton height={30} width={200} />
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.username}</h1>
                <p className="text-lg text-gray-600">{profileData.email}</p>
                <button onClick={handleEditClick} className="mt-2 px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition">
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Purchased Courses</h2>
          {loading ? (
            <Skeleton count={3} height={100} />
          ) : (
            <>
              {profileData.purchasedCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileData.purchasedCourses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg shadow-md p-4 flex justify-around text-center items-center transition-transform duration-300 transform hover:scale-105"
                    >
                      <img
                        src={course.thumbnailUrl}
                        alt={course.name}
                        className="h-28 w-28 rounded-md mb-4 shadow-md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No courses purchased yet.</p>
              )}
            </>
          )}
        </div>

        {/* Creator Section */}
        {profileData.isCreator && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Creator Profile</h2>
            {loading ? (
              <Skeleton height={50} />
            ) : (
              <p className="text-gray-700 bg-gray-100 p-4 rounded-md shadow-md italic">{profileData.bio}</p>
            )}
            <div className="flex space-x-4">
              {profileData.instagram && (
                <a
                  href={profileData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-500 transition"
                >
                  <FaInstagram size={24} />
                </a>
              )}
              {profileData.youtube && (
                <a
                  href={profileData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  <FaYoutube size={24} />
                </a>
              )}
              {profileData.linkedIn && (
                <a
                  href={profileData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-700 transition"
                >
                  <FaLinkedin size={24} />
                </a>
              )}
              {profileData.twitter && (
                <a
                  href={profileData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400 transition"
                >
                  <FaTwitter size={24} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    name="username"
                    value={newProfileData.username}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={newProfileData.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Profile Picture:</label>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 hover:text-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'} transition`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
