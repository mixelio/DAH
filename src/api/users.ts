import { client } from '../utils/fetchClient';
import { User } from '../types/User';

export const getUsers = async () => {
  try {
    const response = await client.get<User[]>("user/");
    return response;
  }
  catch (error) {
    console.error('Error:', error);
    return
  }
};

export const getUser = (id: number) => {
  return client.get<User>(`user/${id}`)
};

export const createUser = (data: Pick<User, "first_name" | "email" | "password">) => {
  return client.post<User>("user/register/", data);
};

export const getLoginedUser = (token: string) => {
  const response = client.get<User>("user/me/", token);
  return response;
}

export const changeUser = (
  data: Partial<
    Pick<
      User,
      "first_name" | "last_name" | "location" | "about_me" | "photo_url"
    >
  >,
  token: string
) => {
  return client.patch<User>(`user/me/`, data, token);
};

export const changeUserPhoto = (data: FormData, token: string) => {
  return client.patch(`user/me/`, data, token)
};

export const loginUser = (data: {"email": string, "password": string}) =>{
  return client.post<{access: string, refresh: string}>('user/token/', data)
};

export const verifyUser = (token: string) => {
  return client.post<{success: boolean}>('user/token/verify/', {token: token}, token);
};

export const getUserFavourites = (token: string) => {
  return client.get<User>(`favorites/`, token);
}

export const addToFavourite = ({dream_id: dream_id}: {dream_id: number}, token: string) => {
  return client.post(`favorites/`, {dream_id: dream_id}, token);
}

export const removeFromFavorite = ({dream_id: dream_id}: {dream_id: number}, token: string) => {
  return client.delete(`favorites/${dream_id}/`, token);
}
