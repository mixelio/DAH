import {API_KEY} from "./apiGoogle";

export const getAdress = async (): Promise<string[]> => {
  try{
    const getPosition = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      })} 
    const position = await getPosition();
    const {latitude, longitude} = position.coords;
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if(data.status === "OK"){
      return data.results[0].formatted_address.split(",");
    } else {
      console.error("Failed to fetch address: ", data.error_message);
      return [];
    }
  } catch (error) {
    console.error("Failed to get location: ", error);
    return [];
  }
}
