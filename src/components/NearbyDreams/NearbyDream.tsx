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
  const [adressLoading, setAdressLoading] = useState<boolean>(false);
  const [onlyCity, setOnlyCity] = useState<string>("");
  const [dreamsNearby, setDreamsNearby] = useState<Dream[]>([]);

  const city = adress[1]
  const country = adress[2]

  useEffect(() => {
    setAdressLoading(true);
    const fetchAdress = async () => {
      try {
        const data = await getAdress();
        setAdress(data);
        setAdressLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAdress();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  useEffect(() => {
    dispatch(dreamsInit());
  }, [dispatch]);

  return (
    <section className="nearby-dreams">
      <div className="container">
        <div className="nearby-dreams__title-block">
          <h2 className="title nearby-dreams__title">Nearby Dreams</h2>
          {adressLoading ? (
            <p className="nearby-dreams__location">
              loading...
            </p>
          ) : (
            <p className="nearby-dreams__location">
              Near <strong>{`${onlyCity}, ${country}`}</strong>
            </p>
          )}
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