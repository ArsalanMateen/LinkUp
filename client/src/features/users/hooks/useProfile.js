import { useCallback } from "react";
import { read } from "../api/usersApi";
import { useAuth } from "../../auth/context/AuthProvider";
import useResource from "../../../shared/hooks/useResource";

export default function useProfile(userId) {
  const { session } = useAuth();

  const token = session?.token;

  const load = useCallback(
    async (signal) => {
      const user = await read({ userId }, { t: token }, signal);
      return { user, followOverrides: {} };
    },
    [userId, token],
  );

  return useResource(load);
}
