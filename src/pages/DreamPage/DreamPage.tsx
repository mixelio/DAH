import {useContext, useEffect, useState} from "react"
import {DreamsContext} from "../../DreamsContext"
import {Link, useParams} from "react-router-dom";
import {Avatar, Divider} from "@mui/material";
import {User} from "../../types/User";
import {getAuthor} from "../../utils/getAuthor";

export const DreamPage = () => {
  const { currentDream, dreams, setCurrentDream, users } = useContext(DreamsContext);
  const [author, setAuthor] = useState<User | null>(null);
  const { id } = useParams();

  useEffect(() => {
    setCurrentDream(dreams.find((dream) => String(dream.id) === id) || null);
    if (currentDream && users) {
      setAuthor(getAuthor(currentDream.userId, users) || null)
    }
    
  }, [id, dreams, users, currentDream, setCurrentDream])
  

  return (
    <section className="dream">
      <div className="container">
        {currentDream && author && (
          <div className="dream__content">
            <p className="dream__category">{currentDream.category}</p>
            <h2 className="dream__title">{currentDream.name}</h2>
            <Link to={`/${author.id}`} className="dream__author-info">
              <Avatar
                className="dream-cart__author-avatar"
                alt="Remy Sharp"
                src={author && author.photo}
                sx={{ width: 38, height: 38 }}
              ></Avatar>
              <div className="dream__author-text-info">
                <p className="dream__author-name">
                  {author.first_name + " " + author.last_name}
                </p>
                <p className="dream__author-location">{author.location}</p>
              </div>
            </Link>
            <Divider sx={{ mb: 2 }} />
            <div className="dream__dream-info">
              <div className="dream__image-container">
                <img
                  className="dream__main-image"
                  src={currentDream.image}
                  alt=""
                />
                <div className="dream__sub-info dream__sub-info--1"></div>
                <div className="dream__sub-info dream__sub-info--2"></div>
                <div className="dream__sub-info dream__sub-info--3"></div>
              </div>
              <p className="dream__description">{currentDream.description}</p>
              <Divider sx={{ mb: 2 }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}