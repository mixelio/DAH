import {useEffect, useState, useRef} from "react"
import {Link, useNavigate, useParams} from "react-router-dom";

import {Avatar, Button, CircularProgress, Divider, IconButton, InputAdornment, LinearProgress, OutlinedInput, Snackbar, TextField} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InsertCommentIcon from "@mui/icons-material/InsertComment";

import {User} from "../../types/User";
import { Dream, DreamCategory, DreamStatus } from "../../types/Dream";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {closeDream, donateToCurrentDream, dreamsInit} from "../../features/dreamsFeature";
import {usersInit} from "../../features/users";
import {
  acceptUnpaidDream,
  cancelUnpaidDream,
  commentAdd,
  commentsInit,
  removeCurrentDream,
} from "../../features/currentDreamFeature";

import { Comment } from "../../components/Comment/Comment";

import {isImageAvailable} from "../../utils/isImageAvailable";
import { getDream } from "../../api/dreams";
import { getUser } from "../../api/users";

import styles from "./DreamPage.module.scss";

export const DreamPage = () => {
  const {dreams} = useAppSelector(store => store.dreams);
  const {users} = useAppSelector(store => store.users);
  const {comments, commentsLoading} = useAppSelector(store => store.currentDream);
  const { id } = useParams();
  const userFromLocaleStorage = localStorage.getItem("currentUser");

  const [paySuccessSnackbar, setPaySuccessSnackbar] = useState<boolean>(false);
  const [status, setStatus] = useState<DreamStatus | null>(null)
  const [postImage, setPostImage] = useState<string>("");
  const [currentDream, setCurrentDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [waitDreamClosing, setWaitDreamClosing] = useState<boolean>(false);
  const [loginedUser, setLoginedUser] = useState<User | null>(null);
  const [isOwnerHere, setIsOwnerHere] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // * work with dialog

  const dialogForHelpRef = useRef<HTMLDialogElement>(null);
  const dialogForDonateRef = useRef<HTMLDialogElement>(null);
  const dialogForMessageRef = useRef<HTMLDialogElement>(null);

  const openMessageDialog = () => {
    dialogForMessageRef.current?.showModal();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  const openDialog = () => {
    dialogForHelpRef.current?.showModal();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }

  const openDonateDialog = () => {
    dialogForDonateRef.current?.showModal();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }

  const closeDialog = () => {
    dialogForHelpRef.current?.close();
    dialogForDonateRef.current?.close();
    dialogForMessageRef.current?.close();
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = `0px`;
  }

  const dispatch = useAppDispatch();

  //#region Handlers

  const handleCloseSnackbar = () => {
    setPaySuccessSnackbar(false);
  };

  const handleRemoveDream = async (id: number) => {
    try {
      await dispatch(removeCurrentDream({
        dreamId: id, 
        token: localStorage.getItem("access") ?? ""
      }));
    } catch (e) {
      console.error(e)
    } finally {
      navigate(`/profile/${userFromLocaleStorage}`);
    }

  };

  // * handler for adding comment to the dream

  const handleCommentAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const comment = formData.get("text") as string;

      if(comment.trim() === '') {
        return
      }
      
      const accessToken = localStorage.getItem("access");

      if (id && comment && accessToken) {
        await dispatch(
          commentAdd({
            dreamId: id,
            comment: { text: comment.trim() },
            token: accessToken,
          })
        ).unwrap();
      }
      

    } catch (e) { 
      console.error(e); 
    } finally {
      if (commentInputRef.current) {
        commentInputRef.current.value = "";
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogForHelpRef.current;
    const donateDialog = dialogForDonateRef.current;
    const messageDialog = dialogForMessageRef.current;

    if(dialog && e.target === dialog) {
      closeDialog();
    }
    if(donateDialog && e.target === donateDialog) {
      closeDialog();
    }
    if(messageDialog && e.target === messageDialog) {
      closeDialog()
    }
  }

  // * handler for closing dream

  const handleCloseDream = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitDreamClosing(true);
    const formData = new FormData(e.currentTarget);
    if (id) {
      try {
        await dispatch(
          closeDream({
            id: +id,
            data: {contribution_description: `${formData.get(
              "contribution_description"
            )}, email: ${loginedUser?.email}`},
            token: localStorage.getItem("access") ?? "",
          })
        )
        setStatus(DreamStatus.Completed);
      } catch (e) {
        console.error(e)
        return
      }

      setWaitDreamClosing(false);
      closeDialog();
    }
  }

  // * handler for donating to the dream

  const handleDonate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitDreamClosing(true);
    const formData = new FormData(e.currentTarget);

    if (id && formData.get("contribution_amount")) {
      try {
        const response = await dispatch(
          donateToCurrentDream({
            id: +id,
            data: {
              contribution_amount: +(formData.get("contribution_amount") ?? 1),
              return_url: window.location.href,
            },
            token: localStorage.getItem("access") ?? "",
          })
        );

        const {session_url} = response.payload as { 
          session_url: string
        };
        localStorage.setItem("payingDream", `${id} payed`);
        window.open(session_url, "_self");
      } catch (e) {
        console.error(e)
        return;
      }

      setWaitDreamClosing(false);
      closeDialog();
    }
  }

  const handleDreamAccept = async () => {
    setWaitDreamClosing(true);
    if (id) {
      try {
        await dispatch(acceptUnpaidDream({dreamId: +id, token: localStorage.getItem("access") ?? ""}));
      } catch (e) {
        console.error(e)
        return
      }
    }

    setWaitDreamClosing(false);
    closeDialog();
    window.location.reload();
  }

  const handleDreamReject = async () => {
    setWaitDreamClosing(true);
    if (id) {
      try {
        await dispatch(
          cancelUnpaidDream({
            dreamId: +id,
            token: localStorage.getItem("access") ?? "",
          })
        );
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setWaitDreamClosing(false);
    closeDialog();
  }

  //#endregion

  const buttonForRealize =
    currentDream && currentDream.category === DreamCategory.Money_donation ? (
      <Button
        variant="contained"
        className="dream__donation-btn button"
        size="large"
        onClick={() => openDonateDialog()}
      >
        Donate
      </Button>
    ) : (
    <Button
          variant="contained"
          className="dream__help-btn button"
          onClick={() => openDialog()}
        >
          I am with you
        </Button>
  );

  //#region hooks

  // useEffect(() => {
  // }, [comments])

  useEffect(() => {
    const initializate = async () => {
      localStorage.setItem("WatchingDream", id ?? "");
      try {
        if (id) {
          await Promise.all([dispatch(dreamsInit()).unwrap(), dispatch(usersInit()).unwrap(), dispatch(commentsInit(id)).unwrap()]);
        }
      } catch (e) {
        console.error(e);
        console.log(e)
      }
    }

    initializate();
    
    if (localStorage.getItem("payingDream")) {
      setPaySuccessSnackbar(true);
      localStorage.removeItem("payingDream");
    }

    return () => {
      localStorage.removeItem("WatchingDream");
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    const dream = dreams.find(dream => dream && id ? +dream.id === +id : null);

    if (dream && user && +dream.user.id === +user) {
      setIsOwnerHere(true)
    } else {setIsOwnerHere(false)}

  }, [dreams, id])

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

          setCurrentDream(dream);
        } catch (e) {
          if (e instanceof Error) {
            if(e.message.includes("404")){
              navigate("/notFound")
            };
          } else {
            console.error(e);
          }
          
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentDream(null);
      }
    };

    fetchDream();
  }, [status, id, navigate]);

  useEffect(() => {
    if (currentDream?.image) {
      isImageAvailable(typeof currentDream.image === 'string' ? currentDream.image : '').then((res) => {
        if (res) {
          setPostImage(typeof currentDream.image === 'string' ? currentDream.image : '');
        } else {
          setPostImage("https://picsum.photos/200/300?random=1");
        }
      });
    } else {
      setPostImage("https://picsum.photos/200/300?random=1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dreams, users, setCurrentDream, postImage]);

  //#endregion

  // console.log(
  //   currentDream,
  //   currentDream?.status
  //     .toLowerCase()
  //     .localeCompare(DreamStatus.Completed.toLowerCase())
  // );
  
  return (
    <section className="dream">
      <div className="container">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={paySuccessSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Payment was successful"
        />
        {currentDream && !loading ? (
          <div className="dream__content">
            <h2 className="dream__title">{currentDream.name} </h2>
            {isOwnerHere && id && (
              <div className="dream__root-buttons">
                <Link
                  to={`./edit`}
                  className="dream__edit-button dream__root-button"
                >
                  <CreateIcon className="dream__edit-icon" />
                </Link>
                <Button
                  className="dream__delete-button dream__root-button"
                  onClick={() => {
                    handleRemoveDream(+id);
                  }}
                >
                  <DeleteIcon className="dream__edit-icon" />
                </Button>
              </div>
            )}

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
                  src={
                    currentDream.image_url ??
                    `https://picsum.photos/1200/600?random=1`
                  }
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
                  <span>{comments.length}</span>
                </div>
                {currentDream.category === DreamCategory.Money_donation && (
                  <div className="dream__sub-info dream__sub-info--3 dream__progress">
                    <span style={{ whiteSpace: "nowrap" }}>
                      {currentDream.accumulated}$
                    </span>
                    {currentDream.category === DreamCategory.Money_donation && (
                      <LinearProgress
                        variant="determinate"
                        value={
                          (currentDream.accumulated / currentDream.cost) * 100
                        }
                        sx={{ width: "100%", height: "2px" }}
                      />
                    )}{" "}
                    {currentDream.accumulated < currentDream.cost ? (
                      <span style={{ whiteSpace: "nowrap" }}>
                        {currentDream.cost - currentDream.accumulated}$ still
                        need
                      </span>
                    ) : (
                      <span style={{ whiteSpace: "nowrap" }}>
                        goal achieved
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Divider sx={{ mb: 2 }} />
              <p className="dream__description">{currentDream.description}</p>
              <Divider sx={{ mb: 2 }} />

              <dialog
                ref={dialogForHelpRef}
                className={styles.dialog}
                onClick={handleBackdropClick}
              >
                {localStorage.getItem("currentUser") ? (
                  <>
                    <p className={styles.dialog__text}>
                      Some text for the first contact
                    </p>
                    <form method="POST" action="/" onSubmit={handleCloseDream}>
                      <TextField
                        className={styles.dialog__input}
                        name="contribution_description"
                        sx={{ width: "100%", marginBlockEnd: "18px" }}
                        multiline
                        minRows={2}
                      />
                      <Button type="submit" variant="outlined">
                        {waitDreamClosing ? "Loading..." : "Send"}
                      </Button>
                    </form>
                  </>
                ) : (
                  <p className={styles.dialog__text}>
                    Only authorized users can help
                  </p>
                )}
              </dialog>

              {/* Dialog for donate */}

              <dialog
                ref={dialogForDonateRef}
                className={styles.dialog}
                onClick={handleBackdropClick}
              >
                <p className={styles.dialog__text}>
                  How much do you want to donate?
                </p>
                <form method="POST" action="/" onSubmit={handleDonate}>
                  <OutlinedInput
                    className={styles.dialog__input}
                    name="contribution_amount"
                    type="number"
                    inputProps={{ min: 1 }}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    sx={{ width: "100%", marginBlockEnd: "18px" }}
                  />
                  <Button type="submit" variant="outlined">
                    {waitDreamClosing ? "Sending..." : "Send"}
                  </Button>
                </form>
              </dialog>

              {/* Dialog for message */}

              {currentDream.contributions && (
                <dialog
                  ref={dialogForMessageRef}
                  onClick={handleBackdropClick}
                  className={styles.dialog}
                >
                  <div className={styles.dialog__messageContent}>
                    <h3>{`${currentDream.contributions?.user.first_name} ${currentDream.contributions?.user.last_name}`}</h3>
                    <p>{currentDream.contributions.description}</p>
                    <div className={styles.dialog__buttonContainer}>
                      {waitDreamClosing && <CircularProgress />}
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleDreamReject}
                      >
                        Reject
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        onClick={handleDreamAccept}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </dialog>
              )}

              {currentDream.status
                .toLowerCase()
                .localeCompare(DreamStatus.Completed.toLowerCase()) ? (
                <div className="dream__after-info">
                  {!isOwnerHere ? (
                    currentDream.status === DreamStatus.New ? (
                      buttonForRealize
                    ) : currentDream.category ===
                      DreamCategory.Money_donation ? (
                      buttonForRealize
                    ) : (
                      <p>in progress...</p>
                    )
                  ) : currentDream.status === DreamStatus.Pending ? (
                    currentDream.category === DreamCategory.Money_donation ? (
                      buttonForRealize
                    ) : (
                      <IconButton
                        className="dream-cart__button"
                        size="large"
                        onClick={openMessageDialog}
                      >
                        <EmailIcon
                          sx={{ color: "#9fd986", fontSize: "32px" }}
                        />
                      </IconButton>
                    )
                  ) : (
                    <p className="dream__realized">Waiting for answer...</p>
                  )}
                  <div className="dream__date">{currentDream.date_added}</div>
                </div>
              ) : (
                <p>Dream come true</p>
              )}
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
                    // disabled={!commentsLoading}
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
                    {commentsLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </form>
              )}

              <Divider textAlign="center" sx={{ mb: 2, mt: 2 }}>
                Comments
              </Divider>

              <div className="dream__comments">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="dream__comments-info-message">no comments</p>
                )}
              </div>
            </div>
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