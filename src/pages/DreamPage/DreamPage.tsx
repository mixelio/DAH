import {useContext, useEffect, useState} from "react"
import {DreamsContext} from "../../DreamsContext"
import {Link, useLocation, useParams} from "react-router-dom";
import {Avatar, Button, CircularProgress, Divider, IconButton, TextField} from "@mui/material";
import {User} from "../../types/User";
import {Comment} from "../../components/Comment/Comment";
import { CommentType } from "../../types/Comment";
import {getUser} from "../../utils/getUser";
import {FacebookShareButton} from "react-share";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {dreamsInit} from "../../features/dreamsFeature";
import {usersInit} from "../../features/users";
import {Dream, DreamCategory} from "../../types/Dream";
import {isImageAvailable} from "../../utils/isImageAvailable";
import { getDream } from "../../api/dreams";

// import LinearProgress from "@mui/material/LinearProgress";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SendIcon from "@mui/icons-material/Send";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import InsertCommentIcon from "@mui/icons-material/InsertComment";


export const DreamPage = () => {
  const {dreams} = useAppSelector(store => store.dreams);
  const {users} = useAppSelector(store => store.users);
  const { id } = useParams();
  const userFromLocaleStorage = localStorage.getItem("currentUser");
  const [postImage, setPostImage] = useState<string>("");
  const [currentDream, setCurrentDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [author, setAuthor] = useState<User | null>(null);
  const [postComments, setPostComments] = useState<CommentType[]>([]);
  const [loginedUser, setLoginedUser] = useState<User | null>(null);

  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  const dispatch = useAppDispatch();

  const { comments } = useContext(DreamsContext);

  useEffect(() => {
    const initializate = async () => {
      try {
        await Promise.all([dispatch(dreamsInit()).unwrap(), dispatch(usersInit()).unwrap()]);
      } catch (e) {
        console.error(e);
      } finally {
        console.log("initializate dreams page")
      }
    }

    initializate();
    console.log("first render of dream page")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log("get dream");
    const fetchDream = async () => {
      if (id) {
        setLoading(true);
        try {
          const dream = await getDream(+id);

          const tempUser: User | null = userFromLocaleStorage
            ? getUser(+userFromLocaleStorage, users) || null
            : null;

          const tempAuthor: User = currentDream?.user !== undefined ? getUser(currentDream.user, users) || {} as User : {} as User;

          setCurrentDream(dream);
          setLoginedUser(tempUser);
          setAuthor(tempAuthor);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentDream(null);
      }
    };

    fetchDream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentDream?.image) {
      isImageAvailable(currentDream.image).then((res) => {
        if (res) {
          setPostImage(currentDream.image);
        } else {
          setPostImage("https://via.placeholder.com/150");
        }
      });
    } else {
      setPostImage("https://via.placeholder.com/150");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dreams, users, setCurrentDream, postImage]);

  useEffect(() => {
    if (comments && currentDream) {
      setPostComments(
        comments.filter((item) => item.dreamId === currentDream.id)
      );
    }
  }, [comments, currentDream]);

  return (
    <section className="dream">
      <div className="container">
        {currentDream && author && !loading ? 
        (
          <div className="dream__content">
            <h2 className="dream__title">{currentDream.name}</h2>
            <Link to={`/profile/${author.id}`} className="dream__author-info">
              <Avatar
                className="dream-cart__author-avatar"
                alt=""
                src={author && author.photo}
                sx={{ width: 38, height: 38 }}
              ></Avatar>
              <div className="dream__author-text-info">
                {author.first_name && (
                  <p className="dream__author-name">
                    {`${author.first_name}${
                      author.last_name ? " " + author.last_name : ""
                    }`}
                    {author.location && (
                      <>
                        ,{" "}
                        <span className="dream__author-location">
                          {author.location}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </Link>

            <div className="dream__dream-info">
              <div className="dream__image-container">
                <img
                  className="dream__main-image"
                  src={`https://picsum.photos/id/${id}/1200/600`}
                  alt=""
                />
              </div>
              <div className="dream__sub-info-box">
                <div className="dream__sub-info dream__sub-info--1">
                  <PeopleAltIcon />
                  <span>{currentDream.views}</span>
                </div>
                {/* <div className="dream__sub-info dream__sub-info--2">
                  <InsertCommentIcon />
                  <span></span>
                </div> */}
                {/* <div className="dream__sub-info dream__sub-info--3 dream__progress">
                  {currentDream.category === DreamCategory.MoneyDonation ? (
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
                </div> */}
              </div>
              <Divider sx={{ mb: 2 }} />
              <p className="dream__description">{currentDream.description}</p>
              <Divider sx={{ mb: 2 }} />
              <div className="dream__after-info">
                {currentDream.category === DreamCategory.MoneyDonation ? (
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
                <div className="dream__date">{currentDream.date_added}</div>
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
            </div>
            <FacebookShareButton
              children
              url={currentUrl}
              style={{ width: "32px", height: "32px" }}
            />
          </div>
        ) : (
          <CircularProgress
            style={{ position: "absolute", top: "50%", left: "50%" }}
            className="dream__waiting"
          />
        )}
      </div>
    </section>
  );
}