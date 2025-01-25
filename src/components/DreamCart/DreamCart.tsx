import React from "react";
import {Link} from "react-router-dom";
import {Dream} from "../../types/Dream";
import { IconButton, LinearProgress } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {actions as userActions, userFavouriteAdd, userFavoriteRemove} from "../../features/users";


type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {
  const dispatch = useAppDispatch();
  const {userFavouriteList} = useAppSelector(store => store.users);
  const loginedUser = localStorage.getItem("currentUser");
  const access = localStorage.getItem("access");

  const addBookmark = (value: Dream) => dispatch(userActions.addToFavourite(value))
  const removeBookmark = (value: Dream) => dispatch(userActions.removeFromFavourite(value))

  const handleAddOrRemoveFavourite = () => {

    if(!loginedUser) {
      return
    }
    if(userFavouriteList.includes(dream)) {
      removeBookmark(dream)
      dispatch(
        userFavoriteRemove({
          dream_id: dream.id,
          token: access ?? "",
        })
      );
      return
    }
    addBookmark(dream);
    dispatch(userFavouriteAdd({
      dream_id: dream.id,
      token: access ?? "",
    }));
  }

  return (
    <div className="dream-cart">
      <div className="dream-cart__image-box">
        <img
          className="lozad dream-cart__image"
          src={dream.image_url ?? "https://picsum.photos/1200/600?random=1"}
          alt="dream_image"
          loading="lazy"
        />
        <IconButton
          className="dream-cart__bookmark"
          onClick={handleAddOrRemoveFavourite}
        >
          {userFavouriteList.find((item) => item.id === dream.id) ? (
            <BookmarkIcon />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
      </div>
      <div className="dream-cart__info-box">
        <h2 className="dream-cart__title">{dream.name}</h2>

        <p className="dream-cart__description">
          {dream.description}
          <Link to={`/dreams/${dream.id}`} className="dream-cart__more">
            {" "}
            <strong>more</strong>
          </Link>
        </p>
        <p className="dream-cart__author-name">{dream.user.first_name}</p>
        <LinearProgress
          className="dream-cart__progress"
          variant="determinate"
          value={25}
          sx={{ width: "100%" }}
        />
        <p className="dream-cart__still-need">
          {`$${dream.cost - dream.accumulated} still need`}
        </p>
      </div>
    </div>
  );
}