export const getDreams = () => {
  return fetch("http://localhost:5173/DAH/api/dreams.json").then((response) => {
    if (!response.ok) {
      console.log("not ok");
    }

    return response.json();
  });
};
