import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {Dream} from "../../types/Dream";
import {DreamsContext} from "../../DreamsContext";
import {Avatar} from "@mui/material";


type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {
  const { users } = useContext(DreamsContext);
  const author = users.find(user => user.id === dream.userId)

  return (
    <Link
      to={String(dream.id)}
      className="dream-cart"
    >
      <img
        className="lozad dream-cart__image"
        src={dream.image}
        alt="dream_image"
        loading="lazy"
      />
      <h2 className="dream-cart__title">{dream.name}</h2>
      <div className="dream-cart__author-info">
        <Avatar
          className="dream-cart__author-avatar"
          alt="Remy Sharp"
          src={author && author.photo}
          sx={{ width: 32, height: 32 }}
        ></Avatar>
        <p className="dream-cart__author-name">{author?.first_name}</p>
      </div>
    </Link>
  );
}