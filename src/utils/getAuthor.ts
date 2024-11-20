import {User} from "../types/User"

export const getAuthor = (userId: number, users: User[]) => {
  return users.find(user => user.id === userId);
}