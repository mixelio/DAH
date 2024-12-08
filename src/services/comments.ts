export const getComments = () => {
  const baseURL = import.meta.env.BASE_URL;

  return fetch(`${baseURL}api/comments.json`).then((response) => {
    if (!response.ok) {
      console.log();
    }

    return response.json();
  });
};
