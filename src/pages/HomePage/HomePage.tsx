import {useEffect} from "react";
import {NearbyDream} from "../../components/NearbyDreams/NearbyDream";
import {useAppDispatch} from "../../app/hooks";
import {usersInit} from "../../features/users";
import Styles from "./HomePage.module.scss";



export const HomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(usersInit());
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="first-screen">
        <div className="container">
          <div className="first-screen__content">
            <img
              src="https://picsum.photos/1200/600?random=2"
              alt=""
              className={Styles.slideImage}
            />
          </div>
        </div>
      </section>
      <NearbyDream />
    </>
  );
};
