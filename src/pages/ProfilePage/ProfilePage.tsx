import {useContext, useRef} from "react"
import {DreamsContext} from "../../DreamsContext"
import {Avatar, Divider, IconButton} from "@mui/material";
import {getUser} from "../../utils/getUser";
import {useParams} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {DreamCart} from "../../components/DreamCart/DreamCart";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const ProfilePage = () => {
  const { users, dreams } = useContext(DreamsContext)

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const userFromLocaleStorage = localStorage.getItem("currentUser");
  const ownerProfile = userFromLocaleStorage ? getUser(+userFromLocaleStorage, users) : null;
  const {id} = useParams();
  const currentProfile = id !== undefined ? getUser(+id, users) : null;
  const dreamsOfUser = dreams.filter(dream => dream.userId === currentProfile?.id);

  return (
    <section className="profile">
      {ownerProfile?.id === currentProfile?.id && (
        <IconButton className="profile__edit-btn">
          <ManageAccountsIcon sx={{ width: "28px", height: "28px" }} />
        </IconButton>
      )}

      <div className="container">
        <div className="profile__main-info">
          <div className="profile__image-box">
            <Avatar
              alt={currentProfile?.first_name}
              src={currentProfile?.photo ?? "/broken-image.jpg"}
              sx={{ width: 156, height: 156 }}
            />
          </div>
          <div className="profile__sub-info">
            <h2 className="profile__name">{`${currentProfile?.first_name} ${currentProfile?.last_name}`}</h2>
            <p className="profile__location">{currentProfile?.location}</p>
            <p className="profile__description">{currentProfile?.about_me}</p>
          </div>
        </div>
        <Divider sx={{ mb: 3, mt: 3 }} />
        <Swiper
          className="profile__slider"
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          spaceBetween={30}
          slidesPerView={1}
        >
          {dreamsOfUser &&
            dreamsOfUser.map((dream, index) => (
              <SwiperSlide key={index} className="profile__slide">
                <DreamCart dream={dream} />
              </SwiperSlide>
            ))}
          <IconButton
            ref={prevRef}
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
            ref={nextRef}
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
    </section>
  );
}