import Post from "./post.model.js";
import errorHandler from "../../shared/errors/dbErrorHandler.js";
import formidable from "formidable";
import mongoose from "mongoose";
import { uploadToR2, deleteFromR2 } from "../../shared/storage/r2.js";
import { listPostSummaries, summarizeLikes } from "./postLists.js";
import {
  feedLimit,
  encodeFeedCursor,
  decodeFeedCursor,
} from "./feedPagination.js";

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
        post.photo = { url, key };
      } catch {
        return res.status(400).json({ error: "Failed to upload image to cloud storage" });
      }
    }

    try {
      const savedPost = await post.save();
      const populatedPost = await Post.findById(savedPost._id)
        .select("-comments")
        .populate("postedBy", "_id name photo")
        .exec();
      const { likes, ...postData } = populatedPost.toObject();

      return res.json({
        ...postData,
        ...summarizeLikes(likes, req.auth._id),
        commentCount: savedPost.comments.length,
      });
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
      .select("-comments")
      .populate("postedBy", "_id name photo")
      .exec();

    if (!post) return res.status(400).json({ error: "Post not found" });

    req.post = post;
    next();
  } catch {
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

    return res.status(404).end();
  } catch {
    return res.status(400).json({ error: "Could not retrieve photo" });
  }
};

const like = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $addToSet: { likes: req.auth._id } },
      { new: true },
    ).select("likes").exec();

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
    ).select("likes").exec();

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

const remove = async (req, res) => {
  try {
    const deletedPost = req.post;

    if (typeof deletedPost.deleteOne === "function") {
      await deletedPost.deleteOne();
    } else {
      await deletedPost.remove();
    }
    if (deletedPost.photo && deletedPost.photo.key) {
      await deleteFromR2(deletedPost.photo.key).catch(console.error);
    }

    return res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const isPoster = (req, res, next) => {
  const isPostAuthor =
    req.post &&
    req.auth &&
    req.post.postedBy._id.toString() === req.auth._id.toString();

  if (!isPostAuthor)
    return res.status(403).json({ error: "User is not authorized" });

  next();
};

const listByUser = async (req, res) => {
  let limit, cursor;

  try {
    limit = feedLimit(req.query.limit);
    if (req.query.cursor !== undefined)
      cursor = decodeFeedCursor(req.query.cursor);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const query = { postedBy: mongoose.Types.ObjectId(req.profile._id) };

  if (cursor) {
    query.$or = [
      { created: { $lt: cursor.created } },
      { created: cursor.created, _id: { $lt: mongoose.Types.ObjectId(cursor.id) } },
    ];
  }

  try {
    const posts = await listPostSummaries(
      query,
      { created: -1, _id: -1 },
      limit + 1,
      req.auth?._id,
    );
    const hasMore = posts.length > limit;
    const pagePosts = hasMore ? posts.slice(0, limit) : posts;

    return res.json({
      posts: pagePosts,
      nextCursor: hasMore
        ? encodeFeedCursor(pagePosts[pagePosts.length - 1])
        : null,
      hasMore,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listNewsFeed = async (req, res) => {
  let limit, cursor;

  try {
    limit = feedLimit(req.query.limit);
    if (req.query.cursor !== undefined)
      cursor = decodeFeedCursor(req.query.cursor);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const targetIds = (req.profile.following || []).map((u) => u._id || u);
  targetIds.push(req.profile._id);
  // Aggregation does not cast IDs automatically like Mongoose find queries do.
  const query = {
    postedBy: { $in: targetIds.map((id) => mongoose.Types.ObjectId(id)) },
  };

  if (cursor) {
    query.$or = [
      { created: { $lt: cursor.created } },
      { created: cursor.created, _id: { $lt: mongoose.Types.ObjectId(cursor.id) } },
    ];
  }

  try {
    const posts = await listPostSummaries(
      query,
      { created: -1, _id: -1 },
      limit + 1,
      req.auth._id,
    );
    const hasMore = posts.length > limit;
    const pagePosts = hasMore ? posts.slice(0, limit) : posts;

    return res.json({
      posts: pagePosts,
      nextCursor: hasMore
        ? encodeFeedCursor(pagePosts[pagePosts.length - 1])
        : null,
      hasMore,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listPublic = async (req, res) => {
  try {
    const posts = await listPostSummaries({}, { created: -1 }, 30, req.auth?._id);
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
  postByID,
  listByUser,
  listNewsFeed,
  listPublic,
  listComments,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  remove,
  isPoster,
};
