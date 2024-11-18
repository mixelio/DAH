import {Link} from "react-router-dom";
import {Dream} from "../../types/Dream";

type Props = {
  dream: Dream;
}

export const DreamCart: React.FC<Props> = ({ dream }) => {
  return (
    <Link to={String(dream.id)} className="dream-cart">
      <img
        src={dream.image}
        alt="dream_image"
        className="dream-cart__image"
      />
    </Link>
  );
}