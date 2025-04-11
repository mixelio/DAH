import {Dream} from "../types/Dream";
import { client } from "../utils/fetchClient";

//#region dream area

export const getDreams = async () => {
  const response = await client.get<Dream[]>("dream/");
  return response;
}

export const getDream = async (id: number, token: string) => {
  const response = await client.get<Dream>(`dream/${id}/`, token);
  return response;
}

export const createDream = async (
  data: FormData, 
  token: string
  ) => {
  const response = await client.post<Dream>('dream/', data, token);
  return response;
}

// ? editDream

export const editDream = async (id: number, data: FormData, token: string) => {
  try {
    await client.patch(`dream/${id}/`, data, token)
  } catch (e) {
    console.error(e)
  }
}

// ? deleteDream

export const deleteDream = async (id: number, token: string) => {
  try {
    await client.delete(`dream/${id}/`, token);
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const createPhotoForDream = async (data: FormData, token: string) => {
  const response = await client.post('dream/', data, token);
  return response;
}

export const countViews = async (id: number, data: Pick<Dream, 'views'>) => {
  const response = await client.patch<Dream>(`dream/${id}/`, data);
  return response;
}

export const closeUnpaydDream = async ({
  id,
  data,
  token,
}: {
  id: number;
  data: { contribution_description: string };
  token: string;
}) => {
  const response = await client.post(`dream/${id}/fulfill/`, data, token);
  return response;
};

export const confirmUnpaydDream = async (
  id: number,
  token: string,
) => {
  const response = await client.patch(`dream/${id}/accept-contribution/`,{}, token);
  return response;
}

export const rejectUnpaydDream = async (
  id: number,
  token: string,
) => {
  const response = await client.patch(`dream/${id}/reject-contribution/`, token);
  return response;
}

export const donatePaydDream = async ({
  id,
  data,
  token,
}: {
  id: number;
  data: { contribution_amount: number, return_url: string };
  token: string;
}) => {
  const response = await client.post(`dream/${id}/fulfill/`, data, token);
  return response;
};

//#endregion

//#region comment area

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

export const editDreamComment = async (
  dreamId: number, 
  commentId: number, 
  data: {text: string}, 
  token: string
) => {
  const response = await client.patch(`dream/${dreamId}/comments/${commentId}/`, data, token);
  return response;
}

export const deleteDreamComment = async (dreamId: number, commentId: number, token: string) => {
  await client.delete(`dream/${dreamId}/comments/${commentId}/`, token)
}

//#endregion