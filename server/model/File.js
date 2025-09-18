import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalname: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", FileSchema);
