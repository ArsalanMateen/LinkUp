import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

let openDialogs = 0;
let originalOverflow = "";
const focusable = (node) =>
  Array.from(
    node.querySelectorAll(
      "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])",
    ),
  ).filter(
    (element) =>
      !element.hidden &&
      !element.matches(":disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      getComputedStyle(element).display !== "none" &&
      getComputedStyle(element).visibility !== "hidden",
  );

// Native modal dialogs make the rest of the page inert and support nested dialogs.
export default function Dialog({
  isOpen,
  onClose,
  label,
  overlayClassName,
  className,
  children,
  busy = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const node = ref.current;
    const opener = document.activeElement;
    if (openDialogs++ === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    node.showModal();
    (focusable(node)[0] || node).focus();
    return () => {
      node.close();
      if (--openDialogs === 0) document.body.style.overflow = originalOverflow;
      if (opener?.isConnected) opener.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const dismiss = (event) => {
    event.preventDefault();
    if (!busy) onClose?.();
  };
  const keyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      dismiss(event);
      return;
    }
    if (event.key !== "Tab") return;
    const elements = focusable(ref.current);
    const first = elements[0],
      last = elements[elements.length - 1];
    if (!first) {
      event.preventDefault();
      ref.current.focus();
    } else if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === ref.current)
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        document.activeElement === ref.current)
    ) {
      event.preventDefault();
      first.focus();
    }
  };
  return createPortal(
    <dialog
      ref={ref}
      aria-label={label}
      aria-modal="true"
      aria-busy={busy}
      tabIndex={-1}
      className={overlayClassName}
      onCancel={dismiss}
      onKeyDown={keyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss(event);
      }}
      style={{
        width: "100vw",
        height: "100dvh",
        maxWidth: "none",
        maxHeight: "none",
        margin: 0,
        border: 0,
        color: "inherit",
      }}
    >
      <div className={className}>{children}</div>
    </dialog>,
    document.body,
  );
}
