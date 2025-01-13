export type CommentType = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string;
  };
  dream: number;
  text: string;
  created_at: string;
};