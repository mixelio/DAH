import {useEffect, useState} from "react"
import {Avatar, CircularProgress, IconButton} from "@mui/material";
// import {getUser} from "../../utils/getUser";
import {useParams,useNavigate,Link} from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {usersInit} from "../../features/users";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {User} from "../../types/User";
import {dreamsInit} from "../../features/dreamsFeature";
import {getUser} from "../../api/users";
import {DreamCart} from "../../components/DreamCart/DreamCart";


export const ProfilePage = () => {
  
  // #region get logined user info
  
  const { dreams } = useAppSelector(store => store.dreams);
  const dispatch = useAppDispatch();

  const currentUserId = localStorage.getItem("currentUser") ?? '';
  const { id } = useParams();
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    dispatch(dreamsInit());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dreams])

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (id) {
        try {
          setLoader(true);
          const user = await getUser(+id);
          setCurrentProfile(user ?? null);
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false);
        }
      }
    }

    fetchCurrentProfile();
    
  }, [id]);

  const dreamsOfUser = dreams.filter(
    (dream) => dream.user?.id === currentProfile?.id
  );

  const navigate = useNavigate();

  useEffect(() => {
    const initializate = async () => {
      try {
        await Promise.all([dispatch(usersInit()).unwrap()]);
      } catch (error) {
        console.error(error);
      }
  }

    initializate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // #endregion

  return (
    <>
      {loader ? (
        <CircularProgress
          style={{ position: "absolute", top: "50%", left: "50%" }}
          className="dream__waiting"
        />
      ) : (
        <section className="profile">
          <div className="container">
            <div className="profile__main-info">
              {/* avatar and user info */}

              <div className="profile__image-box">
                {currentProfile && (
                  <Avatar
                    alt=""
                    src={currentProfile.photo_url}
                    sx={{ width: "100%", height: "100%" }}
                    className="profile__avatar"
                  >
                    {!currentProfile.photo_url && <AccountCircleIcon />}
                  </Avatar>
                )}
              </div>

              <div className="profile__sub-info">
                <h2 className="title profile__name">
                  {`${currentProfile?.first_name} ${currentProfile?.last_name}`}{" "}
                  {currentUserId === id && (
                    <IconButton
                      className="profile__edit-btn"
                      onClick={() => {
                        navigate("edit");
                      }}
                    >
                      <ManageAccountsIcon
                        sx={{ width: "28px", height: "28px" }}
                      />
                    </IconButton>
                  )}
                </h2>
                <p className="profile__location">{currentProfile?.location}</p>
                <p className="profile__description">
                  {currentProfile?.about_me}
                </p>
              </div>
            </div>
            <div className="profile__dreams-container">
              {dreamsOfUser.length > 0 &&
                dreamsOfUser.map((dream) => (
                  <DreamCart key={dream.id} dream={dream} />
                ))}
              {currentUserId === id && (
                <Link to="create" className="profile__add-dream-btn dream-cart" style={{alignItems: "center", justifyContent: "center", fontSize: "18", letterSpacing: "2px"}}>
                  Add a new dream
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}