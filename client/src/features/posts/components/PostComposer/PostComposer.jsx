import React, { useState } from "react";
import { useAuth } from "../../../auth/context/AuthProvider";
import { create } from "../../api/postsApi";
import useAction from "../../../../shared/hooks/useAction";
import { Avatar, Button, Card } from "../../../../shared/ui";
import styles from "./PostComposer.module.css";
export default function PostComposer({ onPostCreated }) {
  const { session } = useAuth();
  const [text, setText] = useState("");
  const action = useAction();
  const submit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    action.run(async () => {
      if (!session) throw new Error("Please sign in to create a post.");
      const body = new FormData();
      body.append("text", text.trim());
      const post = await create(
        { userId: session.user._id },
        { t: session.token },
        body,
      );
      setText("");
      onPostCreated(post);
    });
  };
  return (
    <Card className={styles.root}>
      <form onSubmit={submit}>
        <div className={styles.top}>
          <Avatar user={session?.user} />
          <textarea
            aria-label="Post text"
            className={styles.textarea}
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={action.pending}
          />
        </div>
        {action.error && (
          <p role="alert" className={styles.error}>
            {action.error}
          </p>
        )}
        <div className={styles.bottom}>
          <Button
            type="submit"
            disabled={!text.trim()}
            loading={action.pending}
          >
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}
