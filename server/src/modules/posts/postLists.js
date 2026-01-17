import Post from "./post.model.js";
import mongoose from "mongoose";

export const summarizeLikes = (likes, currentUserId) => ({
  likesCount: likes?.length || 0,
  likedByMe: Boolean(
    currentUserId && likes?.some((id) => String(id) === String(currentUserId)),
  ),
});

export const postListPipeline = (match, sort, limit, currentUserId) => {
  const pipeline = [{ $match: match }, { $sort: sort }];

  if (limit !== undefined) pipeline.push({ $limit: limit });

  pipeline.push(
    {
      $addFields: {
        commentCount: { $size: { $ifNull: ["$comments", []] } },
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        likedByMe: currentUserId
          ? { $in: [mongoose.Types.ObjectId(currentUserId), { $ifNull: ["$likes", []] }] }
          : false,
      }
    },
    {
      $project: {
        _id: 1,
        text: 1,
        photo: 1,
        postedBy: 1,
        created: 1,
        commentCount: 1,
        likesCount: 1,
        likedByMe: 1,
      }
    },
  );

  return pipeline;
};

export const listPostSummaries = async (match, sort, limit, currentUserId) => {
  // Count and omit comments/likes in MongoDB, before returning results to Node.
  const posts = await Post.aggregate(
    postListPipeline(match, sort, limit, currentUserId),
  ).exec();

  // Aggregation already returns plain posts. Also avoid hydrating their authors.
  return Post.populate(posts, {
    path: "postedBy",
    select: "_id name photo",
    options: { lean: true },
  });
};
