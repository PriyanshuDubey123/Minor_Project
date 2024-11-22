//WaterMark data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="64" font-family="Arial" fill="rgba(0,0,0,0.2)"%3EStudyMate%3C/text%3E%3C/svg%3E


import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaSmile } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectToggle } from "../features/ToggleSlice";
import Picker from "emoji-picker-react";
import axios from "axios";
import { selectUserInfo } from "../features/user/userSlice";
import { getMessages, updateMessages, updateOnlineStatus } from "../utils/SocketManager";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const selecttoggle = useSelector(selectToggle);
  const emojiPickerRef = useRef(null);
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/chats/getuserchat/${user.id}`);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/chats/getmessages/${selectedChat._id}`);
        setMessages(response.data);
        console.log("Messages", response.data)
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiObject, event) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    console.log(selectedChat);

    try {

      const response = await axios.post("http://localhost:8080/api/chats/sendmessage", {
        senderId: user.id,
        receiverId: selectedChat.participants[0]._id,
        messageContent: messageInput
      });
      setMessages((prev) => [...prev, { ...response.data, sender: { username: user.name, email: user.email, id: user.id, profilePicture: user.imageUrl } }]);
      filteredChats.map((chat) => {
        if (chat._id.toString() === selectedChat._id.toString()) {
          chat.lastMessage = response.data;
        }
      });
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.participants.some(participant =>
      participant.username.toLowerCase().startsWith(filterText.toLowerCase())
    )
  );

  const location = useLocation();






  useEffect(() => {
    const markMessageAsRead = async () => {
      if (messages?.length && selectedChat) {
        const lastMessage = messages[messages.length - 1];
        console.log(lastMessage)
        if (lastMessage?.chat?.toString() === selectedChat?._id?.toString() && lastMessage?.sender?.id?.toString() !== user.id.toString() && !lastMessage.isRead) {
          try {
            await axios.put(
              `http://localhost:8080/api/chats/updatemessagereadstatus/${lastMessage._id}`, { receiverId: user.id }
            );
          } catch (error) {
            console.error("Error updating message read status:", error);
          }
        }
      }
    };

    markMessageAsRead();
  }, [messages, selectedChat, user.id]);


  useEffect(() => {

    const handleNewMessage = (message) => {

      // Find the chat this message belongs to
      const chatId = message.chat.toString();
      const index = filteredChats.findIndex((chat) => chat._id.toString() === chatId);
      console.log("Chat index:", index);

      if (index !== -1) {
        const updatedChats = [...filteredChats];

        // Increment unreadMessagesCount for other chats
        if (chatId !== selectedChat?._id?.toString()) {
          updatedChats[index].participants = updatedChats[index].participants.map((participant) =>
            participant._id !== user.id
              ? { ...participant, unreadMessagesCount: participant.unreadMessagesCount + 1 }
              : participant
          );
        }

        // Update the lastMessage for the chat
        updatedChats[index].lastMessage = message;

        setChats(updatedChats);
      }

      // Add the message to the messages state if it's for the selected chat
      if (chatId === selectedChat?._id?.toString()) {
        setMessages((prev) => {
          if (!prev.some((msg) => msg._id === message._id)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    };

    // Subscribe to messages
    const unsubscribe = getMessages(user?.id, handleNewMessage);

    return () => {
      if (unsubscribe) {
        console.log("Cleaning up socket listener...");
        unsubscribe(); // Clean up the listener on unmount or dependency change
      }
    };
  });


  useEffect(() => {

    const handleUpdateMessage = (message) => {

      console.log(message);

      setChats((prev) => prev.map((c) => c._id.toString() === message.chat.toString() ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } } : c))


      if (message?.unreadMessagesCount) {
        if (message?.chat.toString() === selectedChat?._id.toString()) {
          setMessages((prev) => prev.map((ms) => ({ ...ms, isRead: true })));

        }
      }
      else {
        if (message?.chat?.toString() === selectedChat?._id?.toString()) {
          setMessages((prev) => prev.map((ms) => ms._id.toString() === message._id.toString() ? { ...ms, isRead: true } : ms));
        }
      }
    };

    const unsubscribe = updateMessages(user?.id, handleUpdateMessage);

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup listener to prevent multiple calls
      }
    };
  }, [user?.id, selectedChat?._id, location.pathname]);


  useEffect(() => {

    const handleUpdateOnlineStatus = (message) => {

      setChats((prev) =>
        prev.map((c) => ({
          ...c,
          participants: c?.participants?.map((p) =>
            p?._id?.toString() === message?.userId?.toString()
              ? { ...p, onlineStatus: message?.status }
              : p
          ),
        }))
      );

      if (selectedChat && selectedChat.participants[0]._id.toString() === message?.userId.toString()) {
        setSelectedChat((prev) => ({ ...prev, participants: prev.participants.map((p) => ({ ...p, onlineStatus: message?.status })) }));
      }


    };

    const unsubscribe = updateOnlineStatus(user?.id, handleUpdateOnlineStatus);

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup listener to prevent multiple calls
      }
    };
  }, [selectedChat]);



  const chatContainerRef = useRef(null);

  // Scrolls to the bottom of the chat container when messages change or a new message is sent
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && messageInput.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectedChat = async (chat) => {
    setSelectedChat(chat);
    console.log("I am chat", chat)
    if (chat?.participants[0]?.unreadMessagesCount > 0) {
      try {
        await axios.put(`http://localhost:8080/api/chats/markchatmessagesasread/${chat._id}/${chat?.participants[0]?._id}`, { userId: user?.id, unreadMessagesCount: chat?.participants[0]?.unreadMessagesCount });
        setChats((prev) => prev.map((c) => c._id.toString() === chat._id.toString() ? { ...c, participants: c.participants.map((p) => p._id.toString() === chat?.participants[0]?._id.toString() ? { ...p, unreadMessagesCount: 0 } : p) } : c));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div
        className={`flex mt-16 h-[calc(100vh-4rem)] bg-gray-50 transition-all duration-300 ${!selecttoggle ? "w-[calc(100vw-20.6rem)]" : "w-[calc(100vw-6.4rem)]"
          }`}
      >
        {/* Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-blue-50 to-gray-100 border-r border-gray-300 flex flex-col h-full">
  {/* Branding */}
  <div className="p-4 bg-blue-600 text-white flex items-center space-x-2 shadow-md">
    <FaComments size={24} />
    <h1 className="text-xl font-bold">StudyMate</h1>
  </div>

  {/* Filter/Search */}
  <div className="p-3">
    <input
      type="text"
      placeholder="Search chats..."
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
    />
  </div>

  {/* Chat List */}
  <div className="flex-grow overflow-y-auto bg-gray-50 divide-y divide-gray-200">

   {!chats  ? (Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center p-4 space-x-3 animate-pulse"
            >
              {/* Profile Picture Skeleton */}
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>

              {/* Chat Details Skeleton */}
              <div className="flex flex-col flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Time Skeleton */}
              <div className="w-10 h-3 bg-gray-200 rounded"></div>
            </div>
          ))):

          filteredChats.length!==0 ? (filteredChats.map((chat) => (
      <div
        key={chat._id}
        className={`flex items-center p-4 space-x-3 cursor-pointer transition-all duration-200 rounded-lg ${
          selectedChat?._id === chat._id
            ? "bg-blue-100 scale-105 shadow-md"
            : "hover:bg-blue-50"
        }`}
        onClick={() => handleSelectedChat(chat)}
      >
        {chat.participants.map((participant) =>
          participant._id !== user.id ? (
            <React.Fragment key={participant._id}>
              {/* Profile Picture */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <img
                  src={
                    participant.profilePicture ||
                    "https://i.pinimg.com/236x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
                  }
                  alt={`${participant.username}'s avatar`}
                  className="w-full h-full rounded-full shadow-lg object-cover"
                />
                {participant.onlineStatus && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              {/* Chat Details */}
              <div className="flex flex-col flex-grow min-w-0">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {participant.username}
                </h2>
                <div className="flex items-center space-x-2">
                  {/* Ticks */}
                  {chat?.lastMessage && (
                    <>
                      {chat?.lastMessage?.sender?.toString() === user.id.toString() ? (
                        chat?.lastMessage.isRead ? (
                          <svg
                            className="w-4 h-4 text-red-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
                            <path
                              d="M13 15l-5-3 1.41-1.41L13 12.17l7.59-7.59L22 6l-7 7z"
                              transform="translate(2, 0)"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-400 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
                            <path
                              d="M13 15l-5-3 1.41-1.41L13 12.17l7.59-7.59L22 6l-7 7z"
                              transform="translate(2, 0)"
                            />
                          </svg>
                        )
                      ) : null}
                    </>
                  )}
                  <p className="text-sm text-gray-600 truncate">
                    {chat?.lastMessage?.message || "No messages yet"}
                  </p>
                </div>
              </div>

              {/* Message Info */}
              <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {chat?.lastMessage?.createdAt
                    ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
                {participant.unreadMessagesCount > 0 &&
                  selectedChat?._id.toString() !== chat?._id.toString() && (
                    <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                      {participant.unreadMessagesCount}
                    </span>
                  )}
              </div>
            </React.Fragment>
          ) : null
        )}
      </div>
    ))):<p className="flex items-center justify-center w-full h-full text-center text-gray-500">No chats found</p>}
  </div>
</div>



        {/* Chat Window */}
        <div className="w-2/3 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-gray-200 shadow-md flex items-center justify-between">
            {selectedChat ? (
              <div className="flex items-center w-full justify-between">
                {/* Chat Info */}
                <div className="flex items-center space-x-4">
                  {selectedChat.participants.map((participant) =>
                    participant._id !== user.id ? (
                      <React.Fragment key={participant._id}>
                        {/* Profile Picture with Online Status */}
                        <div className="relative">
                          <img
                            src={participant.profilePicture || "https://i.pinimg.com/236x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"}
                            alt={`${participant.username}'s avatar`}
                            className="w-12 h-12 rounded-full shadow-lg object-cover"
                          />
                          {participant.onlineStatus && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        {/* User Details */}
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">{participant.username}</h2>
                          <p className="text-sm text-gray-500">
                            {participant.onlineStatus ? (
                              <span className="text-green-600 font-semibold">Online</span>
                            ) : (
                              <span className="text-gray-600">Offline</span>
                            )}
                          </p>
                        </div>
                      </React.Fragment>
                    ) : null
                  )}
                </div>

              </div>
            ) : (
              <h2 className="text-xl font-bold text-gray-800">StudyMate Messaging</h2>
            )}
          </div>


          {/* Conversation Area */}
          <div
  className="flex-grow bg-no-repeat overflow-y-auto p-4 bg-gray-50 rounded-xl shadow-inner"
  ref={chatContainerRef}
  style={{
    backgroundImage: `
      url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')
    `,
    backgroundSize: 'cover', // Ensures it stays at its natural size
    backgroundRepeat: 'no-repeat', // Stops repetition
    backgroundPosition: 'center center', // Places the watermark in the exact center
    width: '100%', // Ensures full width of the container
    height: '100%', // Ensures full height of the container
  }}
>

            {selectedChat ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message?.sender?.id === user?.id ? "justify-end" : "justify-start"} items-start mb-4`}
                >
                  {message?.sender?.id !== user?.id && (
                    <img
                      src={
                        message?.sender?.profilePicture || "https://i.pinimg.com/236x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-gray-400 mr-3"
                    />
                  )}
                  <div
                    className={`relative p-3 rounded-2xl shadow-sm max-w-md break-words border ${message?.sender?.id?.toString() === user?.id?.toString()
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white text-gray-900 border-gray-300"
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message?.message}</p>
                    <div className="text-xs text-gray-900 mt-2 flex justify-between items-center">
                      <span>{new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message?.sender?.id === user?.id && (
                        <span
                          className={`ml-2 flex items-center ${message?.isRead ? 'text-red-500' : 'text-gray-200'} transition-colors`}
                        >
                          {message?.isRead ? (
                            // Double check (read)
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
                              <path d="M13 15l-5-3 1.41-1.41L13 12.17l7.59-7.59L22 6l-7 7z" transform="translate(2, 0)" />
                            </svg>
                          ) : (
                            // Single check (sent but not read)
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
                              <path d="M13 15l-5-3 1.41-1.41L13 12.17l7.59-7.59L22 6l-7 7z" transform="translate(2, 0)" />
                            </svg>
                          )}
                        </span>

                      )}
                    </div>
                  </div>
                  {message?.sender?.id === user?.id && (
                    <img
                      src={
                        user?.imageUrl || "https://i.pinimg.com/236x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-gray-400 ml-3"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 bg-white p-8 rounded-lg shadow-lg">
                <FaComments size={50} className="text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Welcome to StudyMate</h2>
                <p className="text-gray-600">
                  Connect with your peers and enjoy seamless conversations.
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          {selectedChat && (
            <div className="p-4 bg-gray-200 border-t border-gray-300 flex items-center space-x-4">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Type your message..."
              ></textarea>
              <FaSmile
                size={20}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md"
              >
                Send
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-20 right-0 z-50"
                >
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-gray-100 text-center text-sm text-gray-500 border-t border-gray-300">
        Messages are end-to-end encrypted. Only you and the recipient can read them.
      </div>
    </>
  );
};

export default Messages;
