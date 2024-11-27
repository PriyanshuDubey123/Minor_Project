import React from "react";

const OfflinePage = () => {
  const handleRetry = () => {
    window.location.reload(); // Refresh the page to retry the connection
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center px-6">
      <img
        src="../assets/Images/wifioff.png" // Replace with your custom image URL
        alt="Offline Illustration"
        className="w-52 mb-8"
      />
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Oops! You’re Offline
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        It seems you’ve lost your internet connection. Don’t worry, StudyMate is
        here when you’re back online!
      </p>
      <button
        onClick={handleRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Retry Connection
      </button>
    </div>
  );
};

export default OfflinePage;
