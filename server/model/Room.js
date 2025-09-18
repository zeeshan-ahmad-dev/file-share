import mongoose from "mongoose";
import { nanoid } from "nanoid";

const RoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        requried: true,
        unique: true,
        default: () => nanoid(6)
    },
    name: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Room", RoomSchema);