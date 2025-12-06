import { useCallback, useEffect, useState } from "react";
import { getFriendlyErrorMessage } from "../utils/error";

export default function useResource(loader) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: "",
  });
  const retry = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    setState({ data: null, loading: true, error: "" });
    Promise.resolve(loader())
      .then((data) => setState({ data, loading: false, error: "" }))
      .catch((error) =>
        setState({
          data: null,
          loading: false,
          error: getFriendlyErrorMessage(error),
        }),
      );
  }, [loader, version]);

  const setData = useCallback((update) => {
    setState((previous) => ({
      ...previous,
      data: typeof update === "function" ? update(previous.data) : update,
    }));
  }, []);

  return { ...state, retry, setData };
}
