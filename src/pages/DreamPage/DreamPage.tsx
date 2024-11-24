import {useContext, useEffect, useState} from "react"
import {DreamsContext} from "../../DreamsContext"
import {Link, useParams} from "react-router-dom";
import {Avatar, Button, CircularProgress, Divider, IconButton, TextField} from "@mui/material";
import {User} from "../../types/User";
import {getAuthor} from "../../utils/getAuthor";
import FaceIcon from "@mui/icons-material/Face";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LinearProgress from "@mui/material/LinearProgress";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SendIcon from "@mui/icons-material/Send";
import {Comment} from "../../components/Comment/Comment";
import { CommentType } from "../../types/Comment";
import {getUser} from "../../utils/getUser";

export const DreamPage = () => {
  const {
    currentDream,
    dreams,
    setCurrentDream,
    users,
    // currentUser,
    loader,
    setLoader,
    comments,
  } = useContext(DreamsContext);
  const [author, setAuthor] = useState<User | null>(null);
  const [postComments, setPostComments] = useState<CommentType[] | null>(null);
  const { id } = useParams();
  const userFromLocaleStorage = localStorage.getItem("currentUser");
  const [loginedUser, setLoginedUser] = useState<User | null>(null);

  useEffect(() => {
    const tempUser = userFromLocaleStorage ? getUser(+userFromLocaleStorage, users) ?? null : null;
      setLoginedUser(tempUser);
  }, [userFromLocaleStorage, users])

  useEffect(() => {
    setCurrentDream(dreams.find((dream) => String(dream.id) === id) || null);
    if (currentDream && users) {
      setAuthor(getAuthor(currentDream.userId, users) || null);
    }
  }, [id, dreams, users, currentDream, setCurrentDream]);

  useEffect(() => {
    if (comments && currentDream) {
      setPostComments(
        comments.filter((item) => item.dreamId === currentDream.id)
      );
      setLoader(false);
    }
  }, [comments, currentDream, setLoader]);

  return (
    <section className="dream">
      <div className="container">
        {currentDream && author && (
          <div className="dream__content">
            <p className="dream__category">{currentDream.category}</p>
            <h2 className="dream__title">{currentDream.name}</h2>
            <Link to={`/profile/${author.id}`} className="dream__author-info">
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
              </div>
              <div className="dream__sub-info-box">
                <div className="dream__sub-info dream__sub-info--1">
                  <FaceIcon />
                  <span>24</span>
                </div>
                <div className="dream__sub-info dream__sub-info--2">
                  <ChatBubbleOutlineIcon />
                  <span>10</span>
                </div>
                <div className="dream__sub-info dream__sub-info--3 dream__progress">
                  {currentDream.category === "money" ? (
                    <LinearProgress
                      variant="determinate"
                      value={25}
                      sx={{ width: "100%" }}
                    />
                  ) : (
                    <>
                      <HourglassEmptyIcon />
                      <span>waiting...</span>
                    </>
                  )}
                </div>
              </div>
              <Divider sx={{ mb: 2 }} />
              <p className="dream__description">{currentDream.description}</p>
              <Divider sx={{ mb: 2 }} />
              <div className="dream__after-info">
                {currentDream.category === "money" ? (
                  <Button
                    variant="contained"
                    className="dream__donation-btn button"
                    size="large"
                  >
                    Donate
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="dream__help-btn button"
                  >
                    I am with you
                  </Button>
                )}
                <div className="dream__date">{currentDream.created}</div>
              </div>
            </div>
            <div className="dream__comments-box">
              {!loginedUser ? (
                <p className="dream__comments-info-message">
                  Only authorized users can comment
                </p>
              ) : (
                <form method="POST" action="/" className="dream__comment-form">
                  <TextField
                    id="outlined-multiline-static"
                    className="dream__comment-input"
                    label="Write yor comment..."
                    multiline
                    minRows={2}
                  />
                  <IconButton aria-label="sent" className="dream__comment-send">
                    <SendIcon />
                  </IconButton>
                </form>
              )}
              {loader ? (
                <CircularProgress />
              ) : (
                <div className="dream__comments">
                  <Divider textAlign="center" sx={{ mb: 2, mt: 2 }}>
                    Comments
                  </Divider>

                  {postComments && postComments.length > 0 ? (
                    postComments.map((item, index) => (
                      <Comment key={item.id || index} comment={item} />
                    ))
                  ) : (
                    <p className="dream__comments-info-message">no comments</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}