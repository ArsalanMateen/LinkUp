import Post from "../models/post.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  const post = new Post(req.body);
  post.postedBy = req.profile;
  try {
    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate("postedBy", "_id name")
      .exec();
    return res.json(populatedPost);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, listByUser };
