import React from "react";
import {Link} from "react-router-dom";
import {Dream} from "../../types/Dream";


type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {

  return (
    <Link to={String(dream.id)} className="dream-cart">
      <img
        className="lozad dream-cart__image"
        src={dream.image}
        alt="dream_image"
        loading="lazy"
      />
    </Link>
  );
}