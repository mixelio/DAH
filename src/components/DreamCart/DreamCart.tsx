import React /* {useContext} */ from "react";
import {Link} from "react-router-dom";
import {Dream} from "../../types/Dream";
import {useAppSelector} from "../../app/hooks";
import { IconButton, LinearProgress } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";


type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {
  const { users } = useAppSelector((state) => state.users);
  const author = users.find(user => user.id === dream.user);

  return (
    <div className="dream-cart">
      <div className="dream-cart__image-box">
        <img
          className="lozad dream-cart__image"
          src={dream.image_url}
          alt="dream_image"
          loading="lazy"
        />
        <IconButton className="dream-cart__bookmark">
          <BookmarkBorderIcon />
        </IconButton>
      </div>
      <div className="dream-cart__info-box">
        <h2 className="dream-cart__title">{dream.name}</h2>

        <p className="dream-cart__description">
          {dream.description}
          <Link to={`/dreams/${dream.id}`}>
            {" "}
            <strong>more</strong>
          </Link>
        </p>
        <p className="dream-cart__author-name">{author?.first_name}</p>
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