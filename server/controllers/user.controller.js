import User from "../models/user.model.js";
import lodash from "lodash";
const { extend } = lodash;
import errorHandler from "../helpers/dbErrorHandler.js";
import formidable from "formidable";
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
    const user = await User.findById(id);
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

export default {
  create,
  list,
  userByID,
  read,
  update,
};
