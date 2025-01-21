import React, {useEffect}  from "react";
import {Link} from "react-router-dom";
import {Dream} from "../../types/Dream";
import { IconButton, LinearProgress } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {actions as userActions} from "../../features/users";


type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {
  const dispatch = useAppDispatch();
  const {userFavouriteList} = useAppSelector(store => store.users);
  const dreamsFromSrorage = localStorage.getItem("bookmarks");
  const loginedUser = localStorage.getItem("currentUser");

  const addBookmark = (value: Dream) => dispatch(userActions.addToFavourite(value))
  const removeBookmark = (value: Dream) => dispatch(userActions.removeFromFavourite(value))

  const handleAddToFavourite = () => {
    if(!loginedUser) {
      return
    }
    if(userFavouriteList.includes(dream)) {
      removeBookmark(dream)
      return
    }
    addBookmark(dream)
    localStorage.setItem("bookmarks", `${dreamsFromSrorage}, ${dream.id}`);
  }

  useEffect(() => {
    const temp = dreamsFromSrorage?.split(", ");
    temp?.forEach(item => {
      console.log(item)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          onClick={handleAddToFavourite}
        >
          {userFavouriteList.includes(dream) ? (
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