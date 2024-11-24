export const getDreams = () => {
  return fetch("https://mixelio.github.io/DAH/api/dreams.json").then((response) => {
    if (!response.ok) {
      console.log("not ok");
    }

    return response.json();
  });
};
