import User from "./user.model.js";
import lodash from "lodash";
import errorHandler from "../../shared/errors/dbErrorHandler.js";
import formidable from "formidable";
import { uploadToR2, deleteFromR2 } from "../../shared/storage/r2.js";
import mongoose from "mongoose";
import {
  usersLimit,
  encodeUserCursor,
  decodeUserCursor,
} from "./userPagination.js";

const { extend } = lodash;

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
  let limit, cursor;

  try {
    limit = usersLimit(req.query.limit);
    if (req.query.cursor !== undefined)
      cursor = decodeUserCursor(req.query.cursor);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const query = cursor
    ? {
        $or: [
          { created: { $lt: cursor.created } },
          {
            created: cursor.created,
            _id: { $lt: mongoose.Types.ObjectId(cursor.id) },
          },
        ],
      }
    : {};

  try {
    const users = await User.find(query)
      .select("_id name email photo created")
      .sort({ created: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
    const hasMore = users.length > limit;
    const pageUsers = hasMore ? users.slice(0, limit) : users;

    return res.json({
      users: pageUsers,
      nextCursor: hasMore
        ? encodeUserCursor(pageUsers[pageUsers.length - 1])
        : null,
      hasMore,
    });
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

const populateRelationships = (user) =>
  user
    .populate("following", "_id name photo")
    .populate("followers", "_id name photo")
    .execPopulate();

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

const update = async (req, res) => {
  // Account mutation responses historically include populated relationships.
  // Load them here, after authorization, while retaining the document methods.
  try {
    await populateRelationships(req.profile);
  } catch {
    return res.status(400).json({ error: "Could not retrieve user" });
  }

  const uploadForm = new formidable.IncomingForm();
  uploadForm.keepExtensions = true;
  uploadForm.parse(req, async (err, fields, uploadedFiles) => {
    if (err)
      return res.status(400).json({ error: "Photo could not be uploaded" });

    let user = extend(req.profile, fields);
    user.updated = Date.now();

    if (uploadedFiles.photo) {
      try {
        if (user.photo && user.photo.key) {
          await deleteFromR2(user.photo.key).catch(console.error);
        }

        const { url, key } = await uploadToR2(
          uploadedFiles.photo.path,
          uploadedFiles.photo.type,
          "avatars",
        );
        user.photo = { url, key };
      } catch {
        return res
          .status(400)
          .json({ error: "Failed to upload image to cloud storage" });
      }
    }

    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      return res.json(user);
    } catch (saveError) {
      return res
        .status(400)
        .json({ error: errorHandler.getErrorMessage(saveError) });
    }
  });
};

const photo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("photo").lean();

    if (user?.photo?.url) {
      return res.redirect(302, user.photo.url);
    }

    return res.status(404).end();
  } catch {
    return res.status(400).json({ error: "Could not retrieve photo" });
  }
};

const remove = async (req, res) => {
  try {
    await populateRelationships(req.profile);
  } catch {
    return res.status(400).json({ error: "Could not retrieve user" });
  }

  try {
    const deletedUser = req.profile;

    if (typeof deletedUser.deleteOne === "function") {
      await deletedUser.deleteOne();
    } else {
      await deletedUser.remove();
    }
    if (deletedUser.photo && deletedUser.photo.key) {
      await deleteFromR2(deletedUser.photo.key).catch(console.error);
    }

    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;

    return res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

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

const findPeople = async (req, res) => {
  const followingUserIds = (req.profile.following || []).map((u) => u._id || u);
  followingUserIds.push(req.profile._id);

  try {
    const users = await User.find({ _id: { $nin: followingUserIds } })
      .select("_id name about photo")
      .limit(5)
      .lean()
      .exec();

    return res.json(users);
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
  findPeople,
  update,
  photo,
  remove,
};
