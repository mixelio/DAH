import {User} from "../types/User";

export const getUser = (
  userId: number,
  users: User[],
) => {
  return users.find(item => item.id === userId);
};