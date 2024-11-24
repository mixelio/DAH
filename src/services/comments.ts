export const getComments = () => {
  return fetch("https://mixelio.github.io/DAH/api/comments.json").then((response) => {
    if (!response.ok) {
      console.log("not ok");
    }

    return response.json();
  });
};
