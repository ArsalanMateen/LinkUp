import { useCallback, useEffect, useRef, useState } from "react";
import { getFriendlyErrorMessage } from "../utils/error";

// Pass a memoized loader. A changed loader starts a new, cancellable request.
export default function useResource(loader) {
  const active = useRef(false);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({
    loader: null,
    data: null,
    loading: true,
    error: "",
  });
  const retry = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    active.current = true;
    const controller = new AbortController();
    setState((previous) => ({
      loader,
      data: previous.loader === loader ? previous.data : null,
      loading: previous.loader === loader && previous.data !== null ? false : true,
      error: "",
    }));
    Promise.resolve()
      .then(() => loader(controller.signal))
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ loader, data, loading: false, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState((previous) => ({
            loader,
            data: previous.loader === loader ? previous.data : null,
            loading: false,
            error: getFriendlyErrorMessage(error),
          }));
      });
    return () => {
      active.current = false;
      controller.abort();
    };
  }, [loader, version]);
  const setData = useCallback(
    (update) => {
      if (!active.current) return;
      setState((previous) =>
        previous.loader !== loader
          ? previous
          : {
              ...previous,
              data:
                typeof update === "function" ? update(previous.data) : update,
            },
      );
    },
    [loader],
  );
  return {
    ...(state.loader === loader
      ? state
      : { data: null, loading: true, error: "" }),
    retry,
    setData,
  };
}
