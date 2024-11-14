import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperclip, FaSmile, FaEllipsisV } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectToggle } from "../features/ToggleSlice";
import Picker from "emoji-picker-react";
import axios from "axios";
import { selectUserInfo } from "../features/user/userSlice";
import { getMessages, updateMessages } from "../utils/SocketManager";
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
        console.log("Messages",response.data)
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
   
      const response = await axios.post("http://localhost:8080/api/chats/sendmessage", { senderId: user.id,
        receiverId: selectedChat.participants[0]._id,
        messageContent: messageInput});
      setMessages((prev) => [...prev, {...response.data, sender:{username:user.name, email:user.email, id:user.id, profilePicture:user.imageUrl}}]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.participants.some(participant =>
      participant.username.toLowerCase().includes(filterText.toLowerCase())
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
            `http://localhost:8080/api/chats/updatemessagereadststus/${lastMessage._id}`,{receiverId:user.id}
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
    console.log(message, " "); // Debugging log
    console.log(location.pathname);
    console.log(selectedChat);

    if (message?.chat.toString() === selectedChat?._id?.toString()) {
      console.log("Matched");
      setMessages((prev) => [...prev, message]);
    }
  };

  // Subscribe to messages for the current user
  const unsubscribe = getMessages(user?.id, handleNewMessage);

  // Cleanup function to unsubscribe from messages when dependencies change
  return () => {
    if (unsubscribe) {
      unsubscribe(); // Properly cleanup the previous listener
    }
  };
}, [user?.id, selectedChat?._id, location.pathname]);


useEffect(() => {
  const handleNewMessage = (message) => {
    console.log(message, " "); // Debugging log
    console.log(location.pathname);
    if (message?.chat.toString() === selectedChat?._id.toString()) {
      setMessages((prev) => prev.map((ms)=>ms._id.toString() === message._id.toString() ? {...ms,isRead:true}:ms));
    }
  };

  const unsubscribe = updateMessages(user?.id, handleNewMessage);

  return () => {
    if (unsubscribe) {
      unsubscribe(); // Cleanup listener to prevent multiple calls
    }
  };
}, [user?.id, selectedChat?._id, location.pathname]);



const chatContainerRef = useRef(null);

// Scrolls to the bottom of the chat container when messages change or a new message is sent
useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [messages]);


const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey && messageInput.trim() ) {
    e.preventDefault();
    handleSendMessage(); 
  }
};

  return (
    <>
      <div
        className={`flex mt-16 h-[calc(100vh-4rem)] bg-gray-50 transition-all duration-300 ${
          !selecttoggle ? "w-[calc(100vw-20.6rem)]" : "w-[calc(100vw-6.4rem)]"
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
          <div className="flex-grow overflow-y-auto divide-y divide-gray-200">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                className={`flex items-center space-x-3 p-4 cursor-pointer transition-all duration-200 ${
                  selectedChat?._id === chat._id ? "bg-blue-200 scale-105" : "hover:bg-blue-100"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                {chat.participants.map(participant => (
                  participant._id !== user.id && (
                    <React.Fragment key={participant._id}>
                      <div className="relative">
                        <img
                          src={participant.profilePicture || "https://via.placeholder.com/150"}
                          alt={`${participant.username}'s avatar`}
                          className="w-12 h-12 rounded-full shadow-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <h2 className="text-lg font-semibold text-gray-800">{participant.username}</h2>
                      </div>
                    </React.Fragment>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-2/3 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-gray-200 text-black shadow-lg flex items-center justify-between">
            {selectedChat ? (
              <>
                <div className="flex items-center space-x-4">
                  {selectedChat.participants.map((participant) => (
                    participant._id !== user.id && (
                      <React.Fragment key={participant._id}>
                        <img
                          src={participant.profilePicture || "https://via.placeholder.com/150"}
                          alt={`${participant.username}'s avatar`}
                          className="w-10 h-10 rounded-full shadow-md"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">{participant.username}</h2>
                          <p className="text-sm text-gray-500">{participant.email}</p>
                        </div>
                      </React.Fragment>
                    )
                  ))}
                </div>
                <div className="flex items-center space-x-4">
                  <FaEllipsisV size={20} className="cursor-pointer hover:text-blue-300" />
                </div>
              </>
            ) : (
              <h2 className="text-xl font-semibold">StudyMate Messaging</h2>
            )}
          </div>

          {/* Conversation Area */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50 rounded-xl shadow-inner" ref={chatContainerRef}>
  {selectedChat ? (
    messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${message?.sender.id === user.id ? "justify-end" : "justify-start"} items-start mb-4`}
      >
        {message.sender.id !== user.id && (
          <img
            src={
              message.sender.profilePicture || "https://via.placeholder.com/150"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full border border-gray-400 mr-3"
          />
        )}
        <div
          className={`relative p-3 rounded-2xl shadow-sm max-w-md break-words border ${
            message.sender.id?.toString() === user.id?.toString()
              ? "bg-blue-500 text-white border-blue-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.message}</p>
          <div className="text-xs text-gray-900 mt-2 flex justify-between items-center">
            <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {message.sender.id === user.id && (
            <span
            className={`ml-2 flex items-center ${message.isRead ? 'text-red-500' : 'text-gray-200'} transition-colors`}
          >
            {message.isRead ? (
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
        {message.sender.id === user.id && (
          <img
            src={
              user.imageUrl || "https://via.placeholder.com/150"
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
              <FaPaperclip size={20} className="text-gray-600 hover:text-gray-800 cursor-pointer" />
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
