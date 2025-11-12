import Post from "./post.model.js";

export const listPostSummaries = async (query, sort, limit, actor) => {
  const posts = await Post.find(query)
    .sort(sort)
    .limit(limit)
    .populate("postedBy", "_id name photo")
    .lean()
    .exec();
  return posts;
};
