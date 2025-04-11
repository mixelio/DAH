import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Dream, DreamCategory, DreamStatus} from "../../types/Dream";
import { CircularProgress, Divider, IconButton, LinearProgress } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {userFavouriteAdd, userFavoriteRemove, userFavouritesInit} from "../../features/users";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import {ContributionMessage} from "../ContributionMessage/ContributionMessage.tsx";
import {ContributionInfo} from "../ContributionInfo/ContributionInfo.tsx";


type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {
  const dispatch = useAppDispatch();
  const {userFavouriteList} = useAppSelector(store => store.users);
  const loginedUser = localStorage.getItem("currentUser");
  const access = localStorage.getItem("access");
  const allertClass = !dream.status.localeCompare(DreamStatus.Pending) && loginedUser && +dream.user.id === +loginedUser && dream.category !== DreamCategory.Money_donation ? "_pending" : "";

  const [openMessage, setOpenMessage] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  const [waitForFavourite, setWaitForFavourite] = useState(false)

  const handleAddOrRemoveFavourite = async () => {
    
    if(!loginedUser) {
      return
    }
    
    if(userFavouriteList.find(item => item.id === dream.id)) {
      setWaitForFavourite(true);
      await dispatch(
        userFavoriteRemove({
          dream_id: dream.id,
          token: access ?? "",
        })
      );
      await dispatch(userFavouritesInit(access ?? ""));
      setWaitForFavourite(false);
      return;
    }
    setWaitForFavourite(true);
    await dispatch(userFavouriteAdd({
      dream_id: dream.id,
      token: access ?? "",
    }));
    dispatch(userFavouritesInit(access ?? ""));
    setWaitForFavourite(false);
  }

  return (
    <div className={`dream-cart ${allertClass}`}>
      <ContributionMessage
        dream={dream}
        isOpen={openMessage}
        setOpenState={setOpenMessage}
      />
      <ContributionInfo
        dream={dream}
        isOpen={openInfo}
        setOpenState={setOpenInfo}
      />
      <div className="dream-cart__image-box">
        <Link
          to={`/dreams/${dream.id}`}
          onClick={() => {
            localStorage.setItem(
              "lastScrollPosition",
              window.scrollY.toString()
            );
            localStorage.setItem("lastPlaceOnSite", window.location.href);
          }}
        >
          <img
            className="lozad dream-cart__image"
            src={dream.image_url ?? "https://picsum.photos/1200/600?random=1"}
            alt="dream_image"
            loading="lazy"
          />
          {dream.category && (
            <p className="dream-cart__category">
              {dream.category.split("_").join(" ")}
            </p>
          )}
        </Link>
        {loginedUser && (
          <IconButton
            className={`dream-cart__bookmark`}
            onClick={handleAddOrRemoveFavourite}
          >
            {waitForFavourite ? <CircularProgress sx={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0"}} /> : (userFavouriteList.find((item) => item.id === dream.id) ? (
              <BookmarkIcon />
            ) : (
              <BookmarkBorderIcon />
            ))}
          </IconButton>
        )}
      </div>
      <div className="dream-cart__info-box">
        <h2 className="dream-cart__title">
          {dream.name
            .toString()
            .split("")
            .map((item, index) =>
              index === 0 ? item.toUpperCase() : item.toLowerCase()
            )
            .join("")}{" "}
          {allertClass ? (
            <IconButton
              
              className="dream-cart__allert-button"
              onClick={() => setOpenMessage(true)}
            >
              <EmailIcon sx={{ color: "#9fd986" }} />
            </IconButton>
          ) : (
            loginedUser &&
            +loginedUser === dream.user.id &&
            dream.contributions && (
              <IconButton
                className="dream-cart__allert-button"
                onClick={() => setOpenInfo(true)}
                style={{ animation: "none" }}
              >
                <InfoIcon sx={{ color: "#9fd986" }} />
              </IconButton>
            )
          )}
        </h2>

        <p className="dream-cart__description">
          {dream.description}
          <Link to={`/dreams/${dream.id}`} className="dream-cart__more">
            {" "}
            <strong>more</strong>
          </Link>
        </p>
        <p className="dream-cart__author-name">
          {dream.user.first_name}
          <span>{dream.date_added}</span>
        </p>
        {dream.category === DreamCategory.Money_donation ? (
          <LinearProgress
            className="dream-cart__progress"
            variant="determinate"
            value={(dream.accumulated / dream.cost) * 100}
            sx={{ height: "3px", margin: 1.5 }}
          />
        ) : (
          <Divider sx={{ height: "3px", margin: 1.5 }} />
        )}

        {dream.category === DreamCategory.Money_donation ? (
          <p className="dream-cart__still-need">
            {`$${dream.cost - dream.accumulated} still need`}
          </p>
        ) : (
          <p className="dream-cart__still-need">
            {dream.status
              .toLowerCase()
              .localeCompare(DreamStatus.Completed.toLowerCase())
              ? "⌛️"
              : "🎉"}
          </p>
        )}
      </div>
      {/* {allertClass && (
        <dialog className="dream-cart__dialog" open={true}>
          <div className="dream-cart__message">
            <h3>Yor dream can come true</h3>
            
          </div>
        </dialog>
      )} */}
    </div>
  );
}