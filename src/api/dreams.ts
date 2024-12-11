import {Dream} from "../types/Dream";
import { client } from "../utils/fetchClient";

export const getDreams = async () => {
  const response = await client.get<Dream[]>("dream/");
  return response;
}

export const getDream = async (id: number) => {
  const response = await client.get<Dream>(`dream/${id}`);
  return response;
}

export const countViews = async (id: number, data: Pick<Dream, 'views'>) => {
  const response = await client.patch<Dream>(`dream/${id}/`, data);
  return response;
}