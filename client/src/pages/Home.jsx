import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseAPI = import.meta.env.VITE_BACKEND_URL;

function Home() {
  const [isLoader, setIsLoader] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function createRoom() {
    console.log(baseAPI)
    setIsLoader(true);
    try {
      const res = await axios.post(`${baseAPI}/create-room`);
      console.log(res);

      navigate(`/room/${res.data.room.roomId}`);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoader(false);
    }
  }
  async function joinRoom() {
    setIsLoader(true);
    try {
      setError(false);
      const res = await axios.get(`${baseAPI}/room/${roomId}`);
      console.log(res);
      
      if (!res.data.success === true) {
        setError(true);
        setIsLoader(false);
      }
      
      setIsLoader(false);
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.log("Error: ", error);
      setIsLoader(false);
      setError(true);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      {/* loader */}
      {isLoader ? (
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl py-6 px-6 md:p-10 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            File Sharing App
          </h1>
          <p className="text-gray-500 mb-8">
            Create a room to share files or join an existing one with an ID.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              {error && (<span  className="text-red-500 text-sm text-start ">
                Room id not found
              </span>)}
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <button
              onClick={joinRoom}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Join Room
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <button
              onClick={createRoom}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Create Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
