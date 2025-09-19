import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://file-share-z.vercel.app/"],
    methods: ["GET", "POST"]
  },
});

app.set('io', io)

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ["http://localhost:5173", "https://file-share-z.vercel.app/"],
  credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", router);

server.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
