import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {currentUserInit, currentUserUpdate, userPhotoUpdate, usersInit} from "../../features/users";
import {Button, CircularProgress} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const ProfileEdit = () => {
  const { loginedUser } = useAppSelector((store) => store.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const chekTocken = localStorage.getItem("access") ?? "";

  const [location, setLocation] = useState<string>(""); // Для автокомпліту
  const locationRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [dataForChange, setDataForChange] = useState({
    first_name: loginedUser?.first_name ?? "",
    last_name: loginedUser?.last_name ?? "",
    location: loginedUser?.location ?? "",
    email: loginedUser?.email ?? "",
    about_me: loginedUser?.about_me ?? "",
    password: loginedUser?.password ?? "",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        dispatch(usersInit());
        dispatch(currentUserInit(chekTocken));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (!locationRef.current) {
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(locationRef.current, {
      types: ["(cities)"],
      fields: ["address_components"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place && place.formatted_address) {
        setLocation(place.formatted_address);
        if(locationRef.current) {
          locationRef.current.value = place.formatted_address;
        }
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    }
  }, [location]);



  //#region handlers

  const handleBlurOrEnter = async () => {
    // Перевіряємо, чи є щось у полі вводу
    if (!locationRef.current?.value) {
      return; // Якщо поле пусте, виходимо
    }

    // Ініціалізуємо сервіс для отримання передбачень (suggestions)
    const autocompleteService = new google.maps.places.AutocompleteService();

    // Отримуємо передбачення на основі введеного тексту
    autocompleteService.getPlacePredictions(
      { input: locationRef.current.value, types: ["(cities)"] }, // Вхідні параметри: текст із поля та обмеження типу
      (predictions, status) => {
        // Перевіряємо, чи API успішно повернуло результати
        if (locationRef.current) {
          if (
            status === google.maps.places.PlacesServiceStatus.OK && // Статус відповіді "OK"
            predictions && // Є передбачення
            predictions.length > 0 // Є хоча б одне передбачення
          ) {
            locationRef.current.value = predictions[0].description; // Встановлюємо перше передбачення у поле вводу
          } else {
            locationRef.current.value = ""; // Якщо передбачень немає, очищаємо поле
          }
        }
      }
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Запобігаємо стандартній поведінці Enter
      handleBlurOrEnter(); // Викликаємо функцію, щоб встановити значення
    }
  };

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
    }

    try {
      const chekTocken = localStorage.getItem("access") ?? "";
      const form = formRef.current;

      const updatedData = new FormData();

      Object.entries(dataForChange).forEach(([key, value]) => {
        if (key !== "location") {
          if (value) {
            updatedData.append(key, value);
          } else {
            updatedData.append(key, "");
          }
        } else {
          if (locationRef.current) {
            formData.append("location", locationRef.current.value);
          }
        }
      });

      console.log(updatedData.get('about_me'), form)

      dispatch(
        currentUserUpdate({
          data: updatedData,
          token: chekTocken,
        })
      );

      dispatch(
        userPhotoUpdate({
          data: formData,
          token: chekTocken,
        })
      );
    } catch (error) {
      console.log(error);
      alert("Error uploading file!" + error);
    } finally {
      setTimeout(() => {
        setLoader(false);
        navigate(`/profile/${loginedUser?.id}`);
      }, 3000);
      // Перенаправлення на сторінку профілю
    }
  };


  //#endregion

  return (
    <section className="profile-edit">
      <div className="container">
        {loginedUser && (
          <form
            className="profile-edit__change-info"
            onSubmit={handleSubmitChanges}
          >
            <div className="profile-edit__image-block">
              <img
                src={previewUrl ?? loginedUser.photo_url ?? ""}
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
                    ref={locationRef}
                    type="text"
                    name="location"
                    defaultValue={loginedUser?.location}
                    className="profile-edit__input-text"
                    placeholder="enter your city"
                    onChange={(event) => {
                      setLocation(event.target.value);
                    }}
                    onBlur={handleBlurOrEnter}
                    onKeyDown={handleKeyPress}
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
            <button type="submit" className="profile-edit__submit-btn">
              {loader ? <CircularProgress size={16} /> : "Save Changes "}
            </button>
            <button
              className="profile-edit__submit-btn"
              onClick={() => navigate(`/profile/${loginedUser?.id}`)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </section>
  );
}