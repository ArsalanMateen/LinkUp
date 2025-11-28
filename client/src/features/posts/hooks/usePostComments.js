import { useCallback, useEffect, useState } from "react";
import useResource from "../../../shared/hooks/useResource";
import { listComments } from "../api/postsApi";

export default function usePostComments(postId, commentCount = 0) {
  const [requestedId, setRequestedId] = useState(null);

  const requested = requestedId === postId;

  const load = useCallback(
    (signal) => (requested ? listComments(postId, signal) : Promise.resolve(null)),
    [postId, requested],
  );

  const resource = useResource(load);

  const { setData } = resource;

  const [count, setCount] = useState({ postId, value: commentCount });

  useEffect(() => {
    setCount({ postId, value: commentCount });
  }, [postId, commentCount]);

  useEffect(() => {
    if (resource.data)
      setCount({ postId, value: resource.data.comments.length });
  }, [postId, resource.data]);

  const open = useCallback(() => setRequestedId(postId), [postId]);

  const updateComments = useCallback(
    (comments) => setData({ comments }),
    [setData],
  );

  return {
    comments: resource.data?.comments || [],
    count: count.postId === postId ? count.value : commentCount,
    loaded: resource.data !== null,
    loading: requested && resource.loading,
    error: requested ? resource.error : "",
    open,
    retry: resource.retry,
    updateComments,
  };
}
