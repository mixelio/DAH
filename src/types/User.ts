export type User = {
  id: number,
  email: string,
  is_staff: boolean,
  first_name: string,
  last_name: string,
  photo: File | string | null,
  photo_url: string,
  location: string,
  about_me: string,
  num_of_dreams: number,
  password: string,
}

