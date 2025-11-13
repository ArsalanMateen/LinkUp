import React from "react";
import PostCard from "../PostCard/PostCard";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
export default function PostList({
  posts,
  loading,
  error,
  onRetry,
  onRemove,
  onAuthRequired,
}) {
  return (
    <>
      <RequestState loading={loading} error={error} onRetry={onRetry} />
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onRemove={onRemove}
          onAuthRequired={onAuthRequired}
        />
      ))}
      {!loading && !error && !posts.length && <p>No posts yet.</p>}
    </>
  );
}
