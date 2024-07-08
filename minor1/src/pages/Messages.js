import React from 'react'

function Messages() {
  return (
    <div className="flex items-center justify-center h-screen p-5 w-[73vw] ">
      <div className="  p-6 rounded-xl  text-center transition-all duration-300 ease-in-out transform hover:scale-105">
        <p className="text-lg font-semibold text-gray-700">No Messages</p>
      </div>
    </div>
  )
}

export default Messages