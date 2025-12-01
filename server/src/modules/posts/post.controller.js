import Post from "./post.model.js";
import errorHandler from "../../shared/errors/dbErrorHandler.js";
import formidable from "formidable";

import { listPostSummaries, summarizeLikes } from "./postLists.js";

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) return res.status(400).json({ error: "Could not read post" });
    try {
      const post = new Post({ ...fields, postedBy: req.profile._id });
      await post.save();
      return res.json(
        (
          await listPostSummaries(
            { _id: post._id },
            { created: -1 },
            1,
            req.auth._id,
          )
        )[0],
      );
    } catch (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
  });
};

const like = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $addToSet: { likes: req.auth._id } },
      { new: true },
    )
      .select("likes")
      .exec();

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    return res.json(summarizeLikes(updatedPost.likes, req.auth._id));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const unlike = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.auth._id } },
      { new: true },
    )
      .select("likes")
      .exec();

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    return res.json(summarizeLikes(updatedPost.likes, req.auth._id));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const comment = async (req, res) => {
  const commentToAdd = req.body.comment;
  commentToAdd.postedBy = req.body.userId;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: commentToAdd } },
      { new: true },
    )
      .select("comments")
      .populate("comments.postedBy", "_id name photo")
      .exec();

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    return res.json({ comments: updatedPost.comments });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const uncomment = async (req, res) => {
  const commentToRemove = req.body.comment;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: commentToRemove._id } } },
      { new: true },
    )
      .select("comments")
      .populate("comments.postedBy", "_id name photo")
      .exec();

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    return res.json({ comments: updatedPost.comments });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listByUser = async (req, res) => {
  try {
    return res.json(
      await listPostSummaries(
        { postedBy: req.profile._id },
        { created: -1, _id: -1 },
        10,
        req.auth?._id,
      ),
    );
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listNewsFeed = async (req, res) => {
  const targets = [...(req.profile.following || []), req.profile._id];
  try {
    return res.json(
      await listPostSummaries(
        { postedBy: { $in: targets } },
        { created: -1, _id: -1 },
        10,
        req.auth._id,
      ),
    );
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listPublic = async (req, res) => {
  try {
    const posts = await listPostSummaries(
      {},
      { created: -1 },
      30,
      req.auth?._id,
    );
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listComments = async (req, res) => {
  const { postId } = req.params;

  if (!/^[a-f\d]{24}$/i.test(postId))
    return res.status(400).json({ error: "Invalid post ID" });

  try {
    const post = await Post.findById(postId)
      .select("comments -_id")
      .populate("comments.postedBy", "_id name photo")
      .lean()
      .exec();

    if (!post) return res.status(404).json({ error: "Post not found" });

    return res.json({ comments: post.comments || [] });
  } catch {
    return res.status(400).json({ error: "Could not retrieve comments" });
  }
};

export default {
  create,
  listPublic,
  listByUser,
  listNewsFeed,
  listComments,
  comment,
  uncomment,
  like,
  unlike,
};
