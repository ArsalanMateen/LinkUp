import { useCallback, useEffect, useRef, useState } from "react";
import { getFriendlyErrorMessage } from "../utils/error";

export default function useAction() {
  const busy = useRef(false);
  const mounted = useRef(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const run = useCallback(async (operation) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      return await operation();
    } catch (err) {
      if (mounted.current && err.name !== "AbortError")
        setError(getFriendlyErrorMessage(err));
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  }, []);
  return { run, pending, error, setError };
}
