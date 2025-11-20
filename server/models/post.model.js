import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  photo: {
    url: String,
    key: String,
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", PostSchema);
