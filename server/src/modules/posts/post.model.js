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
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.index({ postedBy: 1, created: -1, _id: -1 });
PostSchema.index({ created: -1, _id: -1 });

export default mongoose.model("Post", PostSchema);
