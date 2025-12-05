import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
    node.showModal();
    return () => node.close();
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <dialog
      ref={ref}
      aria-label={label}
      className={overlayClassName}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose?.();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose?.();
      }}
    >
      <div className={className}>{children}</div>
    </dialog>,
    document.body,
  );
}
