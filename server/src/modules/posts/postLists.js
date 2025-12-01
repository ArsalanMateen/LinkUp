import Post from "./post.model.js";
export const summarizeLikes = (likes, actor) => ({
  likesCount: likes?.length || 0,
  likedByMe: Boolean(
    actor && likes?.some((id) => String(id) === String(actor)),
  ),
});
export const listPostSummaries = async (query, sort, limit, actor) => {
  const posts = await Post.find(query)
    .sort(sort)
    .limit(limit)
    .populate("postedBy", "_id name photo")
    .lean()
    .exec();
  return posts.map(({ comments, likes, ...post }) => ({
    ...post,
    ...summarizeLikes(likes, actor),
    commentCount: comments?.length || 0,
  }));
};
