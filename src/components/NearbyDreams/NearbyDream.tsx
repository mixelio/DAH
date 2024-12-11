import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getAdress} from "../../utils/getAdress";
import {Dream} from "../../types/Dream";
import {DreamCart} from "../DreamCart/DreamCart";
import {dreamsInit} from "../../features/dreamsFeature";

export const NearbyDream = () => {
  const {dreams} = useAppSelector(store => store.dreams);
  const dispatch = useAppDispatch();

  const [adress, setAdress] = useState<string[]>([]);
  const [onlyCity, setOnlyCity] = useState<string>("");
  const [dreamsNearby, setDreamsNearby] = useState<Dream[]>([]);

  const [street, city, country] = adress;

  console.log(street, city, country);

  useEffect(() => {
    getAdress().then((data) => setAdress(data));
    // const tempDreams = dreams.filter(
    //   dream => dream.location.toLowerCase() === "kyiv"
    // );
    if(city) {
      setOnlyCity(city.split(" ")[2]);
    } else {
      setOnlyCity("");
    }
    if (dreams.length > 0) {
      setDreamsNearby(dreams.slice(0, 3));
    }
  }, [dreams, city]);

  

  useEffect(() => {
    dispatch(dreamsInit());
  }, [dispatch]);

  return (
    <section className="nearby-dreams">
      <div className="container">
        <div className="nearby-dreams__title-block">
          <h2 className="title nearby-dreams__title">Nearby Dreams</h2>
          <p className="nearby-dreams__location">
            Near <strong>{`${onlyCity}, ${country}`}</strong>
          </p>
        </div>

        <div className="nearby-dreams__content">
          {dreamsNearby.length > 0 ? (
            dreamsNearby.map((dream) => (
              <div key={dream.id} className="nearby-dreams__item">
                <DreamCart dream={dream} />
              </div>
            ))
          ) : (
            <p className="nearby-dreams__empty">No dreams nearby</p>
          )}
        </div>
      </div>
    </section>
  );
};