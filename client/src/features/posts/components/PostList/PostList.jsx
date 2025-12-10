import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../auth/context/AuthProvider";
import PostCard from "../PostCard/PostCard";
import RequestState from "../../../../shared/ui/RequestState/RequestState";

export default function PostList({
  posts = [],
  loading,
  error,
  onRetry,
  onRemove,
  onAuthRequired,
}) {
  const { session } = useAuth();

  const currentUserId = session?.user._id;

  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  // Only the open card attaches this ref to its menu/toggle container.
  const activeMenuRef = useRef(null);

  const toggleMenu = useCallback((postId) => {
    setOpenMenuPostId((previous) => previous === postId ? null : postId);
  }, []);

  const handleRemove = useCallback((post) => {
    setOpenMenuPostId((previous) => previous === post._id ? null : previous);
    onRemove(post);
  }, [onRemove]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (activeMenuRef.current && !activeMenuRef.current.contains(event.target))
        setOpenMenuPostId(null);
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  useEffect(() => {
    if (openMenuPostId !== null && (loading || error || !posts.some((post) =>
      post._id === openMenuPostId && post.postedBy?._id === currentUserId)))
      setOpenMenuPostId(null);
  }, [posts, loading, error, currentUserId, openMenuPostId]);

  if (loading || error)
    return <RequestState loading={loading} error={error} onRetry={onRetry} />;
  if (!posts.length) return <p>No posts yet.</p>;

  return posts.map((post) => (
    <PostCard
      key={post._id}
      post={post}
      onRemove={handleRemove}
      onAuthRequired={onAuthRequired}
      menuOpen={openMenuPostId === post._id}
      onToggleMenu={toggleMenu}
      menuRef={activeMenuRef}
    />
  ));
}
