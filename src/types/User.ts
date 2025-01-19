export type User = {
  id: number,
  email: string,
  is_staff: boolean,
  first_name: string,
  last_name: string,
  photo: File | string | null,
  photo_url: string | undefined,
  location: string | undefined,
  about_me: string | undefined,
  num_of_dreams: number,
  password: string,
}

