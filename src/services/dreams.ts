export const getDreams = () => {
  const baseURL = import.meta.env.BASE_URL;

  return fetch(`${baseURL}api/dreams.json`).then((response) => {
    if (!response.ok) {
      console.log();
    }

    return response.json();
  });
};
