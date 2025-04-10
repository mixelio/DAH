import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getAdress} from "../../utils/getAdress";
import {Dream, DreamStatus} from "../../types/Dream";
import {DreamCart} from "../DreamCart/DreamCart";
import {dreamsInit} from "../../features/dreamsFeature";
import {CircularProgress} from "@mui/material";

export const NearbyDream = ({ className = "" }) => {
  const { dreams } = useAppSelector((store) => store.dreams);
  const dispatch = useAppDispatch();

  const [adress, setAdress] = useState({
    city: "",
    country: "",
  });
  const [adressLoading, setAdressLoading] = useState<boolean>(false);
  const [dreamsLoading, setDreamsLoading] = useState<boolean>(false);
  const [dreamsNearby, setDreamsNearby] = useState<Dream[]>([]);

  useEffect(() => {
    const fetchDreams = async () => {
      setDreamsLoading(true);
      try {
        await dispatch(dreamsInit());

      } catch (error) {
        console.error(error);
      } finally {
        setDreamsLoading(false);
      }
    }

    fetchDreams();
  }, [dispatch])

  useEffect(() => {
    setAdressLoading(true);
    const fetchAdress = async () => {
      try {
        const data = await getAdress();
        setAdress({
          city: data[1].split(" ")[2],
          country: data[2],
        });
        setAdressLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdress();
  }, []);

  useEffect(() => {

  }, )

  useEffect(() => {
    const getNearbyDreams = () => {
      let updatedDreams = [...dreams];
      
      updatedDreams =
        updatedDreams
          .filter(
            dream =>
              dream.location.toLowerCase().split(", ")[0] ===
                adress.city.toLowerCase() &&
              dream.status
                .toLowerCase()
                .localeCompare(DreamStatus.Completed.toLowerCase()))
          .slice(0, 3).length > 0
          ? dreams
              .filter(
                (dream) =>
                  dream.location.toLowerCase().split(", ")[0] ===
                    adress.city.toLowerCase() &&
                  dream.status
                    .toLowerCase()
                    .localeCompare(DreamStatus.Completed.toLowerCase())
              )
              .slice(0, 3)
          : dreams.slice(0, 3);

      setDreamsNearby(updatedDreams);
    };

    getNearbyDreams();
    
  }, [adress, dreams]);

  return (
    <section className={`nearby-dreams ${className}`}>
      <div className="container">
        <div className="nearby-dreams__title-block">
          <h2 className="title nearby-dreams__title">Nearby Dreams</h2>
          {adressLoading && !adress.city && !adress.country ? (
            <p className="nearby-dreams__location">loading...</p>
          ) : (
            <p className="nearby-dreams__location">
              Near <strong>{`${adress.city}, ${adress.country}`}</strong>
            </p>
          )}
        </div>

        <div className="nearby-dreams__content">
          {!dreamsLoading && dreamsNearby.length > 0 ? (
            dreamsNearby.map((dream) => (
              <div key={dream.id} className="nearby-dreams__item">
                <DreamCart dream={dream} />
              </div>
            ))
          ) : (
            dreamsLoading ? <CircularProgress sx={{marginInline: "auto"}} /> :<p className="nearby-dreams__empty" style={{marginInline: "auto"}}>No dreams nearby</p>
          )}
        </div>
      </div>
    </section>
  );
};