import {User} from "../types/User";

export const getUser = (
  user: Pick<User, "first_name" | "email" | "password">,
  users: User[],
) => {
  return users.find(item => item.email === user.email);
};