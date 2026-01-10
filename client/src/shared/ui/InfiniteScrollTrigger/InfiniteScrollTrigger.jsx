import { useEffect, useRef } from "react";

// Detect proximity only. The caller owns pagination, request locks and errors.
export default function InfiniteScrollTrigger({ enabled, onLoadMore, rootRef }) {
  const sentinel = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const node = sentinel.current;
    const root = rootRef?.current || null;
    let active = true,
      requested = false;

    const request = () => {
      if (!active || requested) return;
      requested = true;
      onLoadMore();
    };

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) request();
        },
        { root, rootMargin: "0px 0px 240px 0px" },
      );
      observer.observe(node);

      return () => {
        active = false;
        observer.disconnect();
      };
    }

    // Older browsers use the same proximity trigger, without changing fetching.
    const check = () => {
      const bounds = node.getBoundingClientRect();
      const viewport = root?.getBoundingClientRect() || {
        top: 0,
        bottom: window.innerHeight
      };

      if (bounds.top <= viewport.bottom + 240 && bounds.bottom >= viewport.top)
        request();
    };

    const scrollTarget = root || window;
    scrollTarget.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();

    return () => {
      active = false;
      scrollTarget.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [enabled, onLoadMore, rootRef]);

  return (
    <div
      ref={sentinel}
      data-testid="infinite-scroll-trigger"
      aria-hidden="true"
      style={{ height: 1, flexShrink: 0 }}
    />
  );
}
