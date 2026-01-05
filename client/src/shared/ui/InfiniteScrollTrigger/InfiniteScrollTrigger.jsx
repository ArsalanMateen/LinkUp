import React, { useEffect, useRef } from "react";
export default function InfiniteScrollTrigger({
  enabled,
  onLoadMore,
  rootRef,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    let requested = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!requested && entries.some((entry) => entry.isIntersecting)) {
          requested = true;
          onLoadMore();
        }
      },
      { root: rootRef?.current || null, rootMargin: "240px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, rootRef]);
  return <div ref={ref} aria-hidden="true" style={{ height: 1 }} />;
}
