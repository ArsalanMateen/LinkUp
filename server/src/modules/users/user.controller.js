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

const read = (req, res) => {
  const { _id, name, email, created } = req.profile;
  return res.json({ _id, name, email, created });
};

export default { create, userByID, read };
