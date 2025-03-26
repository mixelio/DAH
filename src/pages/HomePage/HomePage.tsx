import {useEffect, useRef, useState} from "react";
import {NearbyDream} from "../../components/NearbyDreams/NearbyDream";
import {useAppDispatch} from "../../app/hooks";
import {usersInit} from "../../features/users";
import Styles from "./HomePage.module.scss";
import {resetFilters} from "../../utils/resetFilters";
// import {useNavigate} from "react-router-dom";



export const HomePage = () => {
  const dispatch = useAppDispatch();
  const url = localStorage.getItem("lastPlaceOnSite");
  const [currentHeight, setCurrentHeight] = useState(0)

  const contentRef = useRef<HTMLDivElement | null>(null);

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
      } finally {
        if (url && url.localeCompare(window.location.href) === 0) {
          window.scrollTo({
            top: Number(localStorage.getItem("lastScrollPosition")),
            behavior: "smooth"
          })
        }
      }

      if (contentRef.current) {
        setCurrentHeight(contentRef.current.getBoundingClientRect().height + 40);
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
          <div
            className="first-screen__content"
            style={{ height: currentHeight }}
          >
            <img
              src="https://picsum.photos/2400/1200?random=2"
              alt=""
              className={Styles.slideImage}
            />
            <div ref={contentRef} className="first-screen__quote">
              <h1 className="title">
                Dreams are the touchstones of our character.
              </h1>
              <p className="author">Henry David Thoreau</p>
            </div>
          </div>
        </div>
      </section>
      <NearbyDream className="homePage__nearbyDreams" />
    </>
  );
};
