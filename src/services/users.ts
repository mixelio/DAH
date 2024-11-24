export const getUsers = () => {
  return fetch("http://localhost:5173/DAH/api/users.json")
    .then((response) => {
      if (!response.ok) {
        console.log('not ok');
      }

      return response.json();
    })
}