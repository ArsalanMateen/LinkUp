import React from "react";
import PostCard from "./PostCard/PostCard";
import RequestState from "./RequestState";
export default function PostList({
  posts = [],
  loading,
  error,
  onRetry,
  onRemove,
  onAuthRequired,
}) {
  if (loading || error)
    return <RequestState loading={loading} error={error} onRetry={onRetry} />;
  if (!posts.length) return <p>No posts yet.</p>;
  return posts.map((post) => (
    <PostCard
      key={post._id}
      post={post}
      onRemove={onRemove}
      onAuthRequired={onAuthRequired}
    />
  ));
}
