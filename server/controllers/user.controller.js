import User from "../models/user.model.js";
import lodash from "lodash";
const { extend } = lodash;
import errorHandler from "../helpers/dbErrorHandler.js";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadToR2, deleteFromR2 } from "../helpers/storage.js";

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
    const users = await User.find().select("name email updated created");
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("following", "_id name photo")
      .populate("followers", "_id name photo")
      .exec();
    if (!user) return res.status(400).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = (req, res) => {
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
          "avatars"
        );
        user.photo = { url, key, contentType: uploadedFiles.photo.type };
      } catch (uploadError) {
        return res.status(400).json({ error: "Failed to upload image to cloud storage" });
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

const photo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("photo")
      .lean();
    if (user?.photo?.url) {
      return res.redirect(302, user.photo.url);
    }
    if (user?.photo?.data) {
      res.set("Content-Type", user.photo.contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(user.photo.data);
    }
    next();
  } catch (err) {
    next();
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultPhotoPath = fs.existsSync(
  path.resolve(__dirname, "../../client/src/assets/images/placeholder.png"),
)
  ? path.resolve(__dirname, "../../client/src/assets/images/placeholder.png")
  : path.resolve(__dirname, "../../client/assets/images/placeholder.png");

const defaultPhoto = (req, res) => res.sendFile(defaultPhotoPath);

const remove = async (req, res) => {
  try {
    const deletedUser = await req.profile.remove();
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
    )
      .populate("following", "_id name photo")
      .populate("followers", "_id name photo")
      .exec();
    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;
    return res.json(updatedUser);
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
    )
      .populate("following", "_id name photo")
      .populate("followers", "_id name photo")
      .exec();
    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;
    return res.json(updatedUser);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  list,
  userByID,
  read,
  update,
  photo,
  defaultPhoto,
  remove,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
