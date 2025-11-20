import Post from "../models/post.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import formidable from "formidable";
import { uploadToR2, deleteFromR2 } from "../helpers/storage.js";

const create = (req, res) => {
  const uploadForm = new formidable.IncomingForm();
  uploadForm.keepExtensions = true;
  uploadForm.parse(req, async (err, fields, uploadedFiles) => {
    if (err)
      return res.status(400).json({ error: "Image could not be uploaded" });
    const post = new Post(fields);
    post.postedBy = req.profile;
    
    if (uploadedFiles.photo) {
      try {
        const { url, key } = await uploadToR2(
          uploadedFiles.photo.path,
          uploadedFiles.photo.type,
          "posts"
        );
        post.photo = { url, key, contentType: uploadedFiles.photo.type };
      } catch (uploadError) {
        return res.status(400).json({ error: "Failed to upload image to cloud storage" });
      }
    }
    
    try {
      const savedPost = await post.save();
      const populatedPost = await Post.findById(savedPost._id)
        .select("-photo.data")
        .populate("postedBy", "_id name photo")
        .exec();
      return res.json(populatedPost);
    } catch (saveError) {
      return res
        .status(400)
        .json({ error: errorHandler.getErrorMessage(saveError) });
    }
  });
};

const postByID = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id)
      .populate("postedBy", "_id name photo")
      .exec();
    if (!post) return res.status(400).json({ error: "Post not found" });
    req.post = post;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve post" });
  }
};

const photo = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .select("photo")
      .lean();
    if (post?.photo?.url) {
      return res.redirect(302, post.photo.url);
    }
    if (!post?.photo?.data) {
      return res.status(404).end();
    }
    res.set("Content-Type", post.photo.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(post.photo.data);
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve photo" });
  }
};

const like = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true },
    );
    return res.json(updatedPost);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const unlike = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true },
    );
    return res.json(updatedPost);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const isPoster = (req, res, next) => {
  const isPostAuthor =
    req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPostAuthor)
    return res.status(403).json({ error: "User is not authorized" });
  next();
};

const listByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .select("-photo.data")
      .populate("postedBy", "_id name photo")
      .sort("-created")
      .exec();
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listNewsFeed = async (req, res) => {
  const followingUserIds = req.profile.following;
  followingUserIds.push(req.profile._id);
  try {
    const posts = await Post.find({ postedBy: { $in: req.profile.following } })
      .select("-photo.data")
      .populate("postedBy", "_id name photo")
      .sort("-created")
      .exec();
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listPublic = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("-photo.data")
      .populate("postedBy", "_id name photo")
      .sort("-created")
      .limit(30)
      .exec();
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  postByID,
  listByUser,
  listNewsFeed,
  listPublic,
  photo,
  like,
  unlike,
  isPoster,
};
