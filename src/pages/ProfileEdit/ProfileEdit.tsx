import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {currentUserInit, currentUserUpdate, usersInit} from "../../features/users";
import {Button, CircularProgress} from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {useNavigate} from "react-router-dom";
// import {Email} from "@mui/icons-material";

export const ProfileEdit = () => {
  const { loginedUser } = useAppSelector((store) => store.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const chekTocken = localStorage.getItem("access") ?? "";

  useEffect(() => {
    dispatch(usersInit());
    dispatch(currentUserInit(chekTocken));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [loginedUser]);

  // const passInputRef = useRef<HTMLInputElement>(null);

  // const [showPass, setShowPass] = useState(false);
  // const [passChange, setPassChange] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dataForChange, setDataForChange] = useState({
    first_name: loginedUser?.first_name ?? "",
    last_name: loginedUser?.last_name ?? "",
    location: loginedUser?.location ?? "",
    email: loginedUser?.email ?? "",
    about_me: loginedUser?.about_me ?? "",
    password: loginedUser?.password ?? "",
  });

  useEffect(() => {}, [loader]);

  //#region handlers
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();

      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // const handleChangeOpportunity = () => {
  //   setPassChange((allow) => !allow);
  //   setTimeout(() => {
  //     if (passInputRef.current) {
  //       passInputRef.current.focus();
  //     }
  //   }, 0);
  // };

  const handleChangeProfileData = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataForChange((prev) => (
      { ...prev, [event.target.name]: event.target.value }
    ))
  }

  const handleSubmitChanges = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoader(true);
    const formData = new FormData();

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else {
      formData.append("photo", "");
    }

    Object.entries(dataForChange).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      } else {
        formData.append(key, "");
      }
    });

    try {
      const chekTocken = localStorage.getItem("access") ?? "";
      dispatch(
        currentUserUpdate({
          data: formData,
          token: chekTocken,
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      
      setTimeout(() => {
        setLoader(false);
        navigate(`/profile/${loginedUser?.id}`);
      }, 3000)
       // Перенаправлення на сторінку профілю
    }
  };


  //#endregion

  return (
    <section className="profile-edit">
      <div className="container">
        <form
          method="POST"
          className="profile-edit__change-info"
          onSubmit={handleSubmitChanges}
        >
          <div className="profile-edit__image-block">
            <img
              src={previewUrl ?? loginedUser?.photo ?? ""}
              alt=""
              className="profile-edit__image"
            />
            <div className="profile-edit__load-area">
              <Button
                color="primary"
                aria-label="add to shopping cart"
                onClick={handleButtonClick}
              >
                Change picture
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }} // Приховуємо input
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="profile-edit__text-fields-block">
            <div className="profile-edit__sub-block">
              <label className="profile-edit__input-box">
                first name*
                <input
                  type="text"
                  name="first_name"
                  defaultValue={loginedUser?.first_name}
                  className="profile-edit__input-text"
                  placeholder="enter your first name"
                  onChange={handleChangeProfileData}
                />
              </label>
              <label className="profile-edit__input-box">
                last name
                <input
                  type="text"
                  name="last_name"
                  defaultValue={loginedUser?.last_name}
                  className="profile-edit__input-text"
                  placeholder="enter your last name"
                  onChange={handleChangeProfileData}
                />
              </label>
            </div>
            <div className="profile-edit__sub-block">
              <label className="profile-edit__input-box">
                city*
                <input
                  type="text"
                  name="location"
                  defaultValue={loginedUser?.location}
                  className="profile-edit__input-text"
                  placeholder="enter your city"
                  onChange={handleChangeProfileData}
                />
              </label>
              <label className="profile-edit__input-box">
                E-mail*
                <input
                  type="text"
                  name="email"
                  disabled
                  defaultValue={loginedUser?.email}
                  className="profile-edit__input-text profile-edit__input-text--email"
                  placeholder="enter your e-mail"
                  onChange={handleChangeProfileData}
                />
              </label>
            </div>
            <label className="profile-edit__input-box">
              Bio
              <textarea
                name="about_me"
                defaultValue={loginedUser?.about_me}
                className="profile-edit__input-text profile-edit__textarea"
                onChange={handleChangeProfileData}
              ></textarea>
            </label>
          </div>
          {/* <div className="profile-edit__password-block">
            <p className="profile-edit__password-label">Password</p>
            <div className="profile-edit__sub-block">
              <label className="profile-edit__input-box profile-edit__input-box--password">
                <input
                  ref={passInputRef}
                  type={showPass ? "password" : "text"}
                  name="password"
                  defaultValue={loginedUser?.password}
                  disabled={passChange}
                  className="profile-edit__input-text"
                  onChange={handleChangeProfileData}
                />
                <IconButton
                  aria-label="show-password"
                  className="show-password"
                  onClick={() => {
                    setShowPass((show) => !show);
                  }}
                >
                  {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </label>
              <div className="profile-edit__input-box">
                <button
                  type="button"
                  className="profile-edit__change-pass-btn"
                  onClick={handleChangeOpportunity}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div> */}
          <button type="submit" className="profile-edit__submit-btn">
            {loader ? <CircularProgress size={16} /> : "Save Changes "}
          </button>
        </form>
      </div>
    </section>
  );
}