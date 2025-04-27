import usePersistentUseState from "./usePersistentUseState";
import { User } from "../types/User";

const useActiveUser = () => {
  return usePersistentUseState<User | null>("activeUser", null, 3600);
};

export default useActiveUser;
