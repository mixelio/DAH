const API_URL = "https://api.quotable.io/random?tags=dreams";

export const getQuote = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Quote:", data);
    return data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null; // або можна кинути помилку далі
  }
};
