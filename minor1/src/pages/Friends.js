import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaCheck, FaTimes, FaChevronDown, FaEye, FaEllipsisV } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from 'react-router-dom';

// Modal styles
const customModalStyles = {

  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Adding shadow for emphasis
    backgroundColor: "#fff",
    overflowY: 'auto', // Enabling scrolling if the content is long
  }

}

// Card component
const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between w-80 ${className}`}>
    {children}
  </div>
);

const Friends = () => {


  const user = useSelector(selectUserInfo);

  const [friendRequests, setFriendRequests] = useState([]);
  const [findFriends, setFindFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchFriendsData = async () => {
    try {
      const [friendRequests, findFriendsData, myFriendsData] = await Promise.all([
        axios.get(`http://localhost:8080/api/friends/get/friendrequests/${user.id}`),
        axios.get(`http://localhost:8080/api/friends/find/${user.id}`),
        axios.get(`http://localhost:8080/api/friends/get/${user.id}`)
      ])
      setFriendRequests(friendRequests.data || []);
      setFindFriends(findFriendsData.data || []);
      setMyFriends(myFriendsData.data || []);



      console.log(myFriendsData.data);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFriendsData();
  }, [user]);

  const [showMoreRequests, setShowMoreRequests] = useState(false);
  const [showMoreFriends, setShowMoreFriends] = useState(false);
  const [showMoreFindFriends, setShowMoreFindFriends] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleShowMoreRequests = () => setShowMoreRequests(!showMoreRequests);
  const handleShowMoreFriends = () => setShowMoreFriends(!showMoreFriends);
  const handleShowMoreFindFriends = () => setShowMoreFindFriends(!showMoreFindFriends);


  const handleAccept = async (friend) => {
    try {

      const response = await axios.post('http://localhost:8080/api/friends/addfriend', { user: user, friend: friend })
      if (response.status === 200) {
        setFriendRequests((prev) =>
          prev.filter((ele) => ele.userId.toString() !== friend.userId.toString())
        );
        setMyFriends((prev) => [...prev, friend]);
        toast.success(`You have accepted ${friend.username}'s friend request.`);
        await axios.post("http://localhost:8080/api/notifications/post", { userID: friend.userId, data: { content: `"${user?.name}" accepted your friend request`, type: "Real Time Notification" } })
      }
    } catch (error) {
      toast.error(`Error accepting friend request of ${friend.username}.`);
    }
  };

  const handleReject = async (friend) => {
    try {
      const response = await axios.post('http://localhost:8080/api/friends/rejectfriendrequest', { user: user, friend: friend })
      if (response.status === 200) {
        setFriendRequests((prev) =>
          prev.filter((ele) => ele.userId.toString() !== friend.userId.toString())
        );
        toast.error(`You have rejected ${friend.username}'s friend request.`);
        await axios.post("http://localhost:8080/api/notifications/post", { userID: friend.userId, data: { content: `"${user?.name}" rejected your friend request`, type: "Real Time Notification" } })
      }
    } catch (error) {
      toast.error(`Error rejecting friend request of ${friend.username}.`);
    }
  };

  const handleSendRequest = async (friend) => {

    try {

      const response = await axios.post('http://localhost:8080/api/friends/postfriendrequest',
        { userId: friend.userId, friend: { userId: user.id, username: user?.name, profilePicture: user?.imageUrl, email: user?.email, mutualCourses: friend.mutualCourses } })
      if (response.status === 200) {

        setFindFriends((prev) =>
          prev.map((ele) =>
            ele.userId.toString() === friend.userId.toString()
              ? { ...ele, status: "Request Sent" }
              : ele
          )
        );

        toast.success(`Friend request sent to ${friend.username}.`);
        await axios.post("http://localhost:8080/api/notifications/post", { userID: friend.userId, data: { content: `New Friend Request Revieved "${user?.name}"`, type: "Real Time Notification" } })
      }
    } catch (error) {
      toast.error(`Error sending friend request to ${friend.username}.`);
    }
  };

  const openModal = (courses) => {
    setSelectedCourses(courses);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourses([]);
  };


  // State to track which menu is open (null means no menu is open)
  const [menuOpen, setMenuOpen] = useState(null);

  // Toggles the visibility of the dropdown menu for a specific friend
  const toggleMenu = (friendId) => {
    setMenuOpen((prev) => (prev === friendId ? null : friendId));
  };

  // Handler for "Start Chatting" action

  const navigate = useNavigate();

  const handleStartChat = async (friendId) => {

    try {


      console.log(user?.id, friendId)

      const response = await axios.post('http://localhost:8080/api/chats/createchat', {
        senderId: user?.id,
        receiverId: friendId
      });
      if (response.status === 201) {
        toast.success("Chat Created Successfully");
        navigate("/home/messages");
      }
      else if (response.status === 200) {
        navigate("/home/messages");
      }

    } catch (err) {

    }
  };

  // Handler for "Remove Friend" action
  const handleRemoveFriend = async(friend) => {
  
   try{

  const response = await axios.post('http://localhost:8080/api/friends/removefriend', { user: user, friend: friend })

  if (response.status === 200) {
    setMyFriends((prev) =>
      prev.filter((ele) => ele.userId.toString() !== friend.userId.toString())
    );
  }

   }catch(err){

   }


  };


  return (
    <div className="p-8 space-y-16 max-w-7xl mx-auto">
      <Toaster />

      {/* Friend Requests Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center space-x-2">
          <FaUserPlus className="text-blue-500" />
          <span>Friend Requests</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [...Array(3)].map((_, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-lg w-[20vw]">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton circle={true} height={64} width={64} />
                  <div className="flex-1">
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={15} width="40%" />
                  </div>
                </div>
                <div className="mb-4">
                  <Skeleton height={15} width="80%" />
                  <Skeleton height={15} width="90%" />
                  <Skeleton height={15} width="70%" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton height={40} width="45%" />
                  <Skeleton height={40} width="45%" />
                </div>
              </div>
            ))
            : friendRequests.length > 0 ?
              friendRequests?.slice(0, showMoreRequests ? friendRequests.length : 3).map((request, index) => (
                <Card key={index}>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={request.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'}
                      alt={request.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">{request.username}</h3>
                      <p className="text-sm text-gray-500">{request.email}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-600 mb-2">Mutual Courses:</h4>
                    {request?.mutualCourses?.slice(0, 2).map((course, courseIndex) => (
                      <div key={courseIndex} className="flex items-center mb-2">
                        <img
                          src={course.thumbnailUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'}
                          alt={course.name}
                          className="w-12 h-12 rounded mr-3 object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.category}</p>
                        </div>
                      </div>
                    ))}
                    {request?.mutualCourses?.length > 2 && (
                      <button
                        onClick={() => openModal(request.mutualCourses)}
                        className="text-blue-500 text-sm mt-2"
                      >
                        + View More Courses
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between mt-auto space-x-4">
                    <button
                      onClick={() => handleAccept(request)}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex-1 text-sm"
                    >
                      <FaCheck className="inline mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex-1 text-sm"
                    >
                      <FaTimes className="inline mr-2" />
                      Reject
                    </button>
                  </div>
                </Card>
              )) : <p className="text-gray-500 text-center col-span-full">
                No friend requests found.
              </p>}
        </div>
        {!isLoading && friendRequests.length > 3 && (
          <button onClick={handleShowMoreRequests} className="text-blue-500 flex items-center mt-4">
            <FaChevronDown className={`transform ${showMoreRequests ? 'rotate-180' : ''} transition-transform`} />
            <span className="ml-2">{showMoreRequests ? 'View Less' : 'View All Friend Requests'}</span>
          </button>)}
      </section>

      {/* My Friends Section */}

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center space-x-2">
          <FaEye className="text-green-500" />
          <span>My Friends</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [...Array(3)].map((_, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton circle={true} height={64} width={64} />
                  <div className="flex-1">
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={15} width="40%" />
                  </div>
                </div>
                <div className="mb-4">
                  <Skeleton height={15} width="80%" />
                  <Skeleton height={15} width="90%" />
                  <Skeleton height={15} width="70%" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton height={40} width="45%" />
                  <Skeleton height={40} width="45%" />
                </div>
              </div>
            ))
            : myFriends.length > 0
              ? myFriends.slice(0, showMoreFriends ? myFriends.length : 3).map((friend, index) => (
                <Card key={index}>
                  <div className="relative">
                    {/* Three Dots Menu */}
                    <div
                      className="absolute top-2 right-0 cursor-pointer text-gray-500 hover:text-gray-800"
                      onClick={() => toggleMenu(friend.userId)}
                    >
                      <FaEllipsisV size={20} />
                    </div>
                    {menuOpen?.toString() === friend?.userId?.toString() && (
                      <div className="absolute top-8 right-2 bg-gray-100 border rounded-lg shadow-lg w-40 z-10">
                        <button
                          onClick={() => handleStartChat(friend.userId)}
                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                        >
                          Start Chatting
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend)}
                          className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-200"
                        >
                          Remove Friend
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={
                        friend.profilePicture ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'
                      }
                      alt={friend.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">{friend.username}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-600 mb-2">Mutual Courses:</h4>
                    {friend.mutualCourses.slice(0, 2).map((course, courseIndex) => (
                      <div key={courseIndex} className="flex items-center mb-2">
                        <img
                          src={
                            course.thumbnailUrl ||
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'
                          }
                          alt={course.name}
                          className="w-12 h-12 rounded mr-3 object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.category}</p>
                        </div>
                      </div>
                    ))}
                    {friend.mutualCourses.length > 2 && (
                      <button
                        onClick={() => openModal(friend.mutualCourses)}
                        className="text-blue-500 text-sm mt-2"
                      >
                        + View More Courses
                      </button>
                    )}
                  </div>
                </Card>
              ))
              : (
                <p className="text-gray-500 text-center col-span-full">No friends found.</p>
              )}
        </div>
        {!isLoading && myFriends.length > 3 && (
          <button onClick={handleShowMoreFriends} className="text-blue-500 flex items-center mt-4">
            <FaChevronDown
              className={`transform ${showMoreFriends ? 'rotate-180' : ''} transition-transform`}
            />
            <span className="ml-2">{showMoreFriends ? 'View Less' : 'View All My Friends'}</span>
          </button>
        )}
      </section>

      {/* Find Friends Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center space-x-2">
          <FaUserPlus className="text-blue-500" />
          <span>Find Friends</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [...Array(3)].map((_, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton circle={true} height={64} width={64} />
                  <div className="flex-1">
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={15} width="40%" />
                  </div>
                </div>
                <div className="mb-4">
                  <Skeleton height={15} width="80%" />
                  <Skeleton height={15} width="90%" />
                  <Skeleton height={15} width="70%" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton height={40} width="45%" />
                  <Skeleton height={40} width="45%" />
                </div>
              </div>
            ))
            : findFriends.length > 0 ?
              findFriends.slice(0, showMoreFindFriends ? findFriends.length : 3).map((friend, index) => (
                <Card key={index}>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={friend.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'}
                      alt={friend.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">{friend.username}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-600 mb-2">Mutual Courses:</h4>
                    {friend.mutualCourses.slice(0, 2).map((course, courseIndex) => (
                      <div key={courseIndex} className="flex items-center mb-2">
                        <img
                          src={course.thumbnailUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'}
                          alt={course.name}
                          className="w-12 h-12 rounded mr-3 object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.category}</p>
                        </div>
                      </div>
                    ))}
                    {friend.mutualCourses.length > 2 && (
                      <button
                        onClick={() => openModal(friend.mutualCourses)}
                        className="text-blue-500 text-sm mt-2"
                      >
                        + View More Courses
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between mt-auto">
                    {friend.status === "Request Sent" ?
                      <button
                        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex-1 text-sm flex items-center justify-center opacity-60 cursor-not-allowed`}
                        disabled={true}
                      >
                        <FaUserPlus className="mr-2" /> {/* Add the icon here */}
                        Request Sent
                      </button>
                      :
                      <button
                        onClick={() => handleSendRequest(friend)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex-1 text-sm flex items-center justify-center"
                      >
                        <FaUserPlus className="mr-2" /> {/* Add the icon here */}
                        Send Friend Request
                      </button>}
                  </div>
                </Card>
              )) : (<p className="text-gray-500 text-center col-span-full">
                No new friends to find.
              </p>)}
        </div>
        {!isLoading && findFriends.length > 3 && (
          <button onClick={handleShowMoreFindFriends} className="text-blue-500 flex items-center mt-4">
            <FaChevronDown className={`transform ${showMoreFindFriends ? 'rotate-180' : ''} transition-transform`} />
            <span className="ml-2">{showMoreFindFriends ? 'View Less' : 'View All Find Friends'}</span>
          </button>)}
      </section>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Mutual Courses</h3>
        <ul className="space-y-4">
          {selectedCourses.map((course, index) => (
            <li key={index} className="flex items-center">
              <img
                src={course.thumbnailUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMqcCXSPd1GayrYoUaN2o4vaBaiZCOa7v7Q&s'}
                alt={course.name}
                className="w-12 h-12 rounded mr-4 object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{course.name}</p>
                <p className="text-xs text-gray-500">{course.category}</p>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={closeModal}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};





export default Friends;
