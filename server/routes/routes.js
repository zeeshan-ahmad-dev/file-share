import express from "express";
import axios from 'axios';
import File from "../model/File.js";
import Room from "../model/Room.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.send("This api works")
})

router.get("/files/:roomId", async (req, res) => {
  try {
    const {roomId} = req.params;
    console.log(roomId)
    const files = await File.find({roomId});

    res.status(200).json({ message: "Files fetched successfullt!", files });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error" });
  }
});

router.get("/files/:id/download", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const response = await axios({
      method: "GET",
      url: file.url,
      responseType: "stream"
    });

    res.setHeader("Content-Disposition", `attachment; filename="${file.originalname}"`)
    response.data.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error" });
  }
});

router.post("/create-room", async (req, res) => {
  try {
    const room = await Room.create({});
    if (!room) throw new Error("Something went wrong!")
    
    setTimeout(async () => {
      const checkRoom = await Room.findById(room._id);
      if (checkRoom) {
        await Room.findByIdAndDelete(room._id);
        await File.deleteMany({roomId: room._id});
      }
    }, 1000 * 60 * 60);

    res.status(201).json({ message: "Room created Successfully", room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error" });
  }
});

router.get("/room/:roomId", async (req, res) => {
  try {
    const {roomId} = req.params;
    const room = await Room.find({roomId});

    res.status(200).json({ message: "room was found!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error", success: false });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const io = req.app.get("io");
    const file = await File.create({
      roomId: req.body.roomId,
      filename: req.file.originalname,
      originalname: req.file.originalname,
      url: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    io.emit("fileUploaded", file);

    res.status(201).json({ message: "File created sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error" });
  }
});

export default router;
