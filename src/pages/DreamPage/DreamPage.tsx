import {useEffect, useState, useRef} from "react"
import {Link, useLocation, useParams} from "react-router-dom";
import {Avatar, Button, CircularProgress, Divider, IconButton, TextField} from "@mui/material";
import {User} from "../../types/User";
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
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import {commentAdd, commentsInit} from "../../features/currentDreamFeature";
import {getUser} from "../../api/users";
import {Comment} from "../../components/Comment/Comment";

export const DreamPage = () => {
  const {dreams} = useAppSelector(store => store.dreams);
  const {users} = useAppSelector(store => store.users);
  const {comments} = useAppSelector(store => store.currentDream);
  const { id } = useParams();
  const userFromLocaleStorage = localStorage.getItem("currentUser");
  const [postImage, setPostImage] = useState<string>("");
  const [currentDream, setCurrentDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [author, setAuthor] = useState<User | null>(null);
  const [loginedUser, setLoginedUser] = useState<User | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();

  const currentUrl = `${window.location.origin}${location.pathname}`;

  const dispatch = useAppDispatch();

  const handleCommentAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const comment = formData.get("text") as string;
      
      const accessToken = localStorage.getItem("access");

      if (id && comment && accessToken) {
        await dispatch(
          commentAdd({
            dreamId: id,
            comment: { text: comment },
            token: accessToken,
          })
        ).unwrap();
      }
      

    } catch (e) { 
      console.error(e); 
    } finally {
      if (id) {
        await dispatch(commentsInit(id)).unwrap();
        console.log(commentInputRef.current)
        if (commentInputRef.current) {
          commentInputRef.current.value = "";
        }

        console.log("comment added", comments);
      }
    }
  };

  useEffect(() => {
    const initializate = async () => {
      try {
        if (id) {
          await Promise.all([dispatch(dreamsInit()).unwrap(), dispatch(usersInit()).unwrap(), dispatch(commentsInit(id)).unwrap()]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        // console.log("initializate dreams page")
      }
    }

    initializate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const initLoginedUser = async () => {
      if (userFromLocaleStorage) {
        try {
          const tempUser = await getUser(+userFromLocaleStorage);
          setLoginedUser(tempUser ?? null);
        }
        catch (e) {
          console.error(e);
        }
      }
    }

    initLoginedUser();
  }, [userFromLocaleStorage])

  useEffect(() => {
    const fetchDream = async () => {
      if (id) {
        setLoading(true);
        try {
          const dream = await getDream(+id);

          // const tempAuthor: User = currentDream?.user !== undefined ? getUser(currentDream.user, users) || {} as User : {} as User;

          setCurrentDream(dream);
          // setAuthor(tempAuthor);
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


  // console.log(author)
  return (
    <section className="dream">
      <div className="container">
        {currentDream && !loading ? (
          <div className="dream__content">
            <h2 className="dream__title">{currentDream.name}</h2>
            <Link
              to={`/profile/${currentDream.user.id}`}
              className="dream__author-info"
            >
              <Avatar
                className="dream-cart__author-avatar"
                alt=""
                src={currentDream.user.photo_url}
                sx={{ width: 38, height: 38 }}
              ></Avatar>
              <div className="dream__author-text-info">
                {currentDream.user.first_name && (
                  <p className="dream__author-name">
                    {`${currentDream.user.first_name}${
                      currentDream.user.last_name
                        ? " " + currentDream.user.last_name
                        : ""
                    }`}
                    {currentDream.location && (
                      <>
                        ,{" "}
                        <span className="dream__author-location">
                          {currentDream.location}
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
                <div className="dream__sub-info dream__sub-info--2">
                  <InsertCommentIcon />
                  <span></span>
                </div>
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
                <form
                  method="POST"
                  action="/"
                  className="dream__comment-form"
                  onSubmit={handleCommentAdd}
                >
                  <TextField
                    inputRef={commentInputRef}
                    id="outlined-multiline-static"
                    className="dream__comment-input"
                    label="Write yor comment..."
                    name="text"
                    multiline
                    minRows={2}
                  />
                  <IconButton
                    aria-label="sent"
                    className="dream__comment-send"
                    type="submit"
                  >
                    <SendIcon />
                  </IconButton>
                </form>
              )}

              <div className="dream__comments">
                <Divider textAlign="center" sx={{ mb: 2, mt: 2 }}>
                  Comments
                </Divider>

                {comments && comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Comment key={index} comment={comment} />
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