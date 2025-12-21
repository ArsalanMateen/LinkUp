import { useAuth } from "../auth/AuthProvider";
import { remove } from "./api";
import useAction from "../hooks/useAction";
export default function useDeleteAccount(userId, onDeleted) {
  const { session, clearJWT } = useAuth();
  const action = useAction();
  return {
    ...action,
    confirm: () =>
      action.run(async () => {
        if (!session || session.user._id !== userId)
          throw new Error("Please sign in as the account owner.");
        await remove({ userId }, { t: session.token });
        clearJWT(onDeleted);
      }),
  };
}
