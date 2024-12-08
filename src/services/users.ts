
export const getUsers = () => {
  const baseURL = import.meta.env.BASE_URL;

  return fetch(`${baseURL}api/users.json`).then((response) => {
    if (!response.ok) {
      console.log();
    }

    return response.json();
  });
}