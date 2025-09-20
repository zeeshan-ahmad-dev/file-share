# File Sharing MERN Project

A real-time file sharing app built with **MERN (MongoDB, Express, React, Node.js)** and **Socket.IO**, supporting Cloudinary uploads.

## Features

- Create and join rooms to share files.
- Upload files to **Cloudinary**.
- Real-time file updates using **Socket.IO**.
- Download files directly.
- Auto-delete rooms and files after 60 minutes.

## Technologies

- **Frontend:** React, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Realtime:** Socket.IO
- **File Storage:** Cloudinary
- **Environment Variables:** dotenv
- **File Upload:** Multer

## Installation

1. **Clone the repository and install dependencies**

```bash
git clone https://github.com/zeeshan-ahmad-dev/file-share.git
cd file-share
```
2. **Create .env files**

In client folder
```
VITE_BACKEND_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```
In server folder:

```
PORT=8000
MONGO_URI=YOUR_MONGODB_URI
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```
3. **Run the app**

 In one terminal (backend):
```
cd server
npm run dev
```
In another terminal (frontend):
```
cd client
npm run dev
```