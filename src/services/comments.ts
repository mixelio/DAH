export const getComments = () => {
  return fetch("http://localhost:5173/DAH/api/comments.json").then((response) => {
    if (!response.ok) {
      console.log("not ok");
    }

    return response.json();
  });
};
