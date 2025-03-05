import {useEffect} from "react";
import {NearbyDream} from "../../components/NearbyDreams/NearbyDream";
import {useAppDispatch} from "../../app/hooks";
import {usersInit} from "../../features/users";
import Styles from "./HomePage.module.scss";
import {resetFilters} from "../../utils/resetFilters";
// import {useNavigate} from "react-router-dom";



export const HomePage = () => {
  const dispatch = useAppDispatch();
  // const url = localStorage.getItem("returnUrl");
  // const navigate = useNavigate();

  useEffect(() => {
    // if (url) {
    //   localStorage.removeItem("returnUrl");
    //   localStorage.removeItem("session_id");
    //   localStorage.setItem("paySuccess", "success");
    //   navigate(url);
    // }

    const fetchUsers = async () => {
      try {
        await dispatch(usersInit());
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
    resetFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="first-screen">
        <div className="container">
          <div className="first-screen__content">
            <img
              src="https://picsum.photos/2400/1200?random=2"
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
