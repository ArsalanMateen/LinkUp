import User from "./user.model.js";

import errorHandler from "../../shared/errors/dbErrorHandler.js";

const create = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    return res.status(200).json({ message: "Successfully signed up!" });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    return res.json(
      await User.find()
        .select("_id name email created")
        .sort({ created: -1, _id: -1 })
        .limit(20)
        .lean()
        .exec(),
    );
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const publicProfile = (user, actorId) => {
  const fields = [
    "_id",
    "name",
    "email",
    "photo",
    "about",
    "created",
    "updated",
  ];

  return {
    ...Object.fromEntries(fields.map((field) => [field, user[field]])),
    followersCount: (user.followers || []).length,
    followingCount: (user.following || []).length,
    followedByMe: Boolean(
      actorId &&
      (user.followers || []).some(
        (id) => String(id?._id || id) === String(actorId),
      ),
    ),
  };
};

const read = (req, res) => res.json(publicProfile(req.profile, req.auth?._id));

const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const addFollower = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true },
    ).exec();

    return res.json(publicProfile(updatedUser, req.auth?._id));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { following: req.body.unfollowId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeFollower = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId } },
      { new: true },
    ).exec();

    return res.json(publicProfile(updatedUser, req.auth?._id));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
