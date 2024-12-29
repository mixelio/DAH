import {Dream} from "../types/Dream";
import { client } from "../utils/fetchClient";

// dream area

export const getDreams = async () => {
  const response = await client.get<Dream[]>("dream/");
  return response;
}

export const getDream = async (id: number) => {
  const response = await client.get<Dream>(`dream/${id}`);
  return response;
}

export const createDream = async (data: FormData, token: string) => {
  const response = await client.post<Dream>('dream/', data, token);
  return response;
}

export const countViews = async (id: number, data: Pick<Dream, 'views'>) => {
  const response = await client.patch<Dream>(`dream/${id}/`, data);
  return response;
}

// comment area

export const getDreamComments = async (id: number) => {
  const response = await client.get(`dream/${id}/comments/`);
  return response;
}

export const createDreamComment = async (
  id: number,
  data: { text: string },
  token: string,
) => {
  const response = await client.post(`dream/${id}/comments/`, data, token);
  return response;
};