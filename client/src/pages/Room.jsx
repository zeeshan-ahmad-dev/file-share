import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { io } from "socket.io-client";

const baseAPI = import.meta.env.VITE_BACKEND_URL;
const socket = io(baseAPI, { transports: ["websocket"] });

function Room() {
  const [isLoader, setIsLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [controllers, setControllers] = useState({});
  const { roomId } = useParams();

  function handleChange(e) {
    setSelectedFiles([...e.target.files]);
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = "move";

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles([...e.dataTransfer.files]);
    }
  }

  async function handleSubmit() {
    if (!selectedFiles.length > 0) return;
    setIsFileUploading(true);

    selectedFiles.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", roomId);

      const controller = new AbortController();

      setControllers((prevs) => ({ ...prevs, [file.name]: controller }));

      await axios.post(`${baseAPI}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
          setProgress((prevs) => ({
            ...prevs,
            [file.name]: percentCompleted,
          }));
        },
      });

      setProgress((prevs) => ({ ...prevs, [file.name]: 0 }));
      setIsFileUploading(false);
      setControllers((prevs) => {
        const updated = { ...prevs };
        delete updated[file.name];
        return updated;
      });
    });
  }

  function handleCancel(filename) {
    if (controllers[filename]) {
      controllers[filename].abort();

      setControllers((prevs) => {
        const updated = { ...prevs };
        delete updated[filename];
        return updated;
      });
    }
  }

  useEffect(() => {
    (async () => {
      setIsLoader(true);

      try {
        const res = await axios.get(`${baseAPI}/files/${roomId}`);
        setFiles(res.data.files);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoader(false);
      }
    })();
  }, [isFileUploading]);

  useEffect(() => {
    socket.on("fileUploaded", (file) => {
      if (file.roomId === roomId) {
        setFiles((prevs) => [...prevs, file]);
      }
    });

    return () => {
      socket.off("fileUploaded");
    }
  }, [roomId]);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Exit */}
      <Link to="/" className="text-red-500 font-semibold hover:underline">
        Exit Room
      </Link>

      {/* Room Code */}
      <h1 className="text-2xl font-bold mb-8 my-4 text-center">
        Room Code: <span className="text-blue-600">{roomId}</span>
      </h1>

      {/* Upload Section */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className="flex items-center justify-center"
      >
        <label
          htmlFor="file-upload"
          className={`w-full flex flex-col items-center justify-center p-6 md:p-12 border-2 border-dashed rounded-2xl cursor-pointer shadow-md transition ${
            dragActive
              ? "bg-blue-50 border-blue-500"
              : "bg-gray-50 border-gray-300 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-14 h-14 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-gray-700 font-medium">
            Drag & drop your files here or{" "}
            <span className="text-blue-600 underline">browse</span>
          </p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

      {/* File Selected */}
      {selectedFiles.length > 0 && (
        <div className="mt-8 text-center bg-white p-4 rounded-xl shadow">
          <h3 className="md:text-lg font-semibold mb-4">File Selected</h3>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="text-gray-700 mb-2 bg-gray-50 text-left px-3 py-2 rounded-lg shadow-sm truncate text-sm md:text-base flex justify-between items-center"
            >
              <p>{file?.name}</p>
              <span className="text-sm">
                {(file?.size / 1000000).toFixed(2)} MB
              </span>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition cursor-pointer"
          >
            Upload
          </button>
        </div>
      )}

      {/* Uploaded Files */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-2 py-2">
          {/* Upload in progress */}
          {Object.entries(controllers).map(([filename]) => (
            <li
              key={filename}
              className="flex justify-between items-center bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm"
            >
              <span className="truncate text-gray-700">{filename}</span>
              <div className="flex items-center space-x-3">
                {progress[filename] === 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <>
                    <span className="text-sm">{progress[filename]}%</span>
                    <div className="h-1.5 w-20 md:w-32 rounded-lg overflow-hidden border">
                      <div
                        className="h-full bg-green-500 transition-all duration-200"
                        style={{ width: `${progress[filename]}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => handleCancel(filename)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}

          {/* Already uploaded files */}
          {isLoader ? (
            <div className="h-52 flex items-center justify-center">
              <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
              </div>
            </div>
          ) : (
            files &&
            files.map((file) => (
              <li
                key={file._id}
                className="flex justify-between items-center bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm"
              >
                <span className="truncate text-gray-700">
                  {file.originalname}
                </span>
                <a
                  href={`${baseAPI}/files/${file._id}/download`}
                  download={file.originalname}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Download
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Room;
