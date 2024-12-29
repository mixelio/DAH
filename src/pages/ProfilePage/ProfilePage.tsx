import {useEffect, useState} from "react"
import {Avatar, IconButton} from "@mui/material";
import {getUser} from "../../utils/getUser";
import {Link, useNavigate, useParams} from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {currentUserInit, usersInit} from "../../features/users";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {User} from "../../types/User";
import {dreamsInit} from "../../features/dreamsFeature";


export const ProfilePage = () => {
  
  // #region get logined user info

  const { users, loginedUser} = useAppSelector(store => store.users);
  const { dreams } = useAppSelector(store => store.dreams);
  const dispatch = useAppDispatch();

  const chekTocken = localStorage.getItem("access") ?? '';
  const { id } = useParams();
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);

  useEffect(() => {
    dispatch(dreamsInit());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (id) {
        try {
          const user = await getUser(+id, users);
          setCurrentProfile(user ?? null);
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchCurrentProfile();
    
  }, [id, users]);

  const dreamsOfUser = dreams.filter(
    (dream) => dream.user === currentProfile?.id
  );

  const navigate = useNavigate();

  useEffect(() => {
    const initializate = async () => {
      try {
        await Promise.all([dispatch(usersInit()).unwrap(), dispatch(currentUserInit(chekTocken)).unwrap()]);
      } catch (error) {
        console.error(error);
      }
  }

    initializate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // #endregion

  return (
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
              {loginedUser?.id === currentProfile?.id && (
                <IconButton
                  className="profile__edit-btn"
                  onClick={() => {
                    navigate("edit");
                  }}
                >
                  <ManageAccountsIcon sx={{ width: "28px", height: "28px" }} />
                </IconButton>
              )}
            </h2>
            <p className="profile__location">{currentProfile?.location}</p>
            <p className="profile__description">{currentProfile?.about_me}</p>
          </div>
        </div>
        {dreamsOfUser.length > 0 && dreamsOfUser.map(dream => (
          <div 
            key={dream.id} 
            className="profile__dream"
          >
            {dream.name}
          </div>
        ))}
        {loginedUser?.id === currentProfile?.id && (
          <Link to="create" className="profile__add-dream-btn">
            Add a new dream
          </Link>
        )}
      </div>
    </section>
  );
}