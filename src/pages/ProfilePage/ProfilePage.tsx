import {useContext, useEffect} from "react"
import {DreamsContext} from "../../DreamsContext"
import {Avatar, Button, Divider, IconButton} from "@mui/material";
import { useMediaQuery } from "react-responsive";
import {getUser} from "../../utils/getUser";
import {useNavigate, useParams} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {DreamCart} from "../../components/DreamCart/DreamCart";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {currentUserInit, usersInit} from "../../features/users";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


export const ProfilePage = () => {
  const { dreams } = useContext(DreamsContext);

  // #region get logined user info

  const { users, loginedUser} = useAppSelector(store => store.users);
  const dispatch = useAppDispatch();

  const chekTocken = localStorage.getItem("access") ?? '';

  useEffect(() => {
    dispatch(usersInit());
    dispatch(currentUserInit(chekTocken));
    console.log(currentProfile?.photo_url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // #endregion

  // const userFromLocaleStorage = localStorage.getItem("currentUser");
  // const ownerProfile = userFromLocaleStorage ? getUser(+userFromLocaleStorage, users) : null;
  const {id} = useParams();
  const currentProfile = id !== undefined ? getUser(+id, users) : null;
  const dreamsOfUser = dreams.filter(dream => dream.user === currentProfile?.id);
  console.log(!!currentProfile?.photo);

  const navigate = useNavigate();

  const isTablet = useMediaQuery({ query: "(min-width: 640px)" });
  const isDesctop = useMediaQuery({ query: "(min-width: 1200px)" });

  

  const slidesPerView = () => {
    if (isDesctop) {
      return 3;
    }

    if (isTablet) {
      return 2;
    }

    return 1;
  };

  return (
    <section className="profile">
      <div className="container">
        <div className="profile__main-info">
          {/* avatar and user info */}

          <div className="profile__image-box">
            <Avatar
              alt=""
              src={currentProfile?.photo_url}
              sx={{ width: 156, height: 156 }}
            >
              {!loginedUser?.photo && <AccountCircleIcon />}
            </Avatar>
          </div>

          <div className="profile__sub-info">
            <h2 className="title profile__name">
              {`${currentProfile?.first_name} ${currentProfile?.last_name}`}{" "}
              {loginedUser?.id === currentProfile?.id && (
                <IconButton
                  className="profile__edit-btn"
                  onClick={() => {
                    navigate("edit");
                  }}
                >
                  <ManageAccountsIcon sx={{ width: "28px", height: "28px" }} />
                </IconButton>
              )}
            </h2>
            <p className="profile__location">{currentProfile?.location}</p>
            <p className="profile__description">{currentProfile?.about_me}</p>
          </div>
        </div>
        {loginedUser?.id === currentProfile?.id && (
          <Button variant="contained" className="profile__add-dream-btn">
            Add a Dream
          </Button>
        )}
        {dreamsOfUser.length > 0 && (
          <div className="profile__dreams-of-user">
            <Divider textAlign="center" sx={{ mb: 3, mt: 3 }}>
              Dreams {dreamsOfUser.length}
            </Divider>
            <Swiper
              className="profile__slider"
              modules={[Navigation]}
              navigation={{
                prevEl: `#profile-prev-btn-${currentProfile?.id}`,
                nextEl: `#profile-next-btn-${currentProfile?.id}`,
              }}
              spaceBetween={30}
              slidesPerView={slidesPerView()}
            >
              {dreamsOfUser &&
                dreamsOfUser.map((dream, index) => (
                  <SwiperSlide key={index} className="profile__slide">
                    <DreamCart dream={dream} />
                  </SwiperSlide>
                ))}
              <IconButton
                id={`profile-prev-btn-${currentProfile?.id}`}
                style={{
                  position: "absolute",
                  background: "#fff",
                  top: "50%",
                  left: "10px",
                  zIndex: 10,
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                id={`profile-next-btn-${currentProfile?.id}`}
                style={{
                  position: "absolute",
                  background: "#fff",
                  top: "50%",
                  right: "10px",
                  zIndex: 10,
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}