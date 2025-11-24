import Post from "./post.model.js";
import errorHandler from "../../shared/errors/dbErrorHandler.js";
import formidable from "formidable";

import { listPostSummaries } from "./postLists.js";

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) return res.status(400).json({ error: "Could not read post" });
    try {
      const post = new Post({ ...fields, postedBy: req.profile._id });
      await post.save();
      return res.json(
        await Post.findById(post._id)
          .populate("postedBy", "_id name")
          .lean()
          .exec(),
      );
    } catch (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
  });
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

export default { create, listPublic, listByUser, listNewsFeed };
