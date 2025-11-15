import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", PostSchema);
