import { useCallback } from "react";
import { list } from "../api/usersApi";
import useResource from "../../../shared/hooks/useResource";
export default function useUsers() {
  const load = useCallback((signal) => list({}, signal), []);
  const resource = useResource(load);
  return { ...resource, users: resource.data || [], refresh: resource.retry };
}
