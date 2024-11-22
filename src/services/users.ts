export const getUsers = () => {
  return fetch("https://mixelio.github.io/DAH/api/users.json")
    .then((response) => {
      if (!response.ok) {
        console.log('not ok');
      }

      return response.json();
    })
}