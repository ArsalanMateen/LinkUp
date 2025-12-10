import React from "react";
import styles from "./RequestState.module.css";

export default function RequestState({ loading, error, onRetry, inline }) {
  const className = inline ? `${styles.state} ${styles.inline}` : styles.state;
  if (loading)
    return (
      <p role="status" className={className}>
        Loading…
      </p>
    );
  if (!error) return null;
  return (
    <div role="alert" className={className}>
      <p>{error}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
