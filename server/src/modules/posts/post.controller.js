import Post from "./post.model.js";
import errorHandler from "../../shared/errors/dbErrorHandler.js";
import formidable from "formidable";

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

export default { create };
