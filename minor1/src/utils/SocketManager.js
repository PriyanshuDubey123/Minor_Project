import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
  
  socket = io("http://localhost:8080");
  socket.on("connect", () => {
    console.log("Socket Connected");
  });
};


export const registerUser = (userId) => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  socket.emit("register", userId);
};

export const subscribeToNotifications = (userId, callback) => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  socket.on("notification", callback);
};
export const getMessages = (userId, callback) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return () => {}; // Return a no-op cleanup function
  }

  // Define the event listener
  const messageListener = (message) => {
      callback(message);
  };

  // Add the listener
  socket.on("messages", messageListener);

  // Return a cleanup function to remove the listener
  return () => {
    socket.off("messages", messageListener);
  };
};

export const updateMessages = (userId, callback) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return () => {}; // Return a no-op cleanup function
  }

  // Define the event listener
  const messageListener = (message) => {
      callback(message);
  };

  // Add the listener
  socket.on("updateMessages", messageListener);

  // Return a cleanup function to remove the listener
  return () => {
    socket.off("updateMessages", messageListener);
  };
};

export const disconnectSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  socket.disconnect();
};
