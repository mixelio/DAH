import {Button, IconButton, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import {FormEvent, useEffect, useState} from "react"

import { theme } from "../../utils/theme";
import {userPasswordReset, userPasswordUpdate} from "../../features/users";
import {useAppDispatch} from "../../app/hooks";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
const colorsPrimary = theme.palette.primary;

enum PasswordResetStatus {
  EMAIL_INPUT = "email-input",
  SUCCESS = "success",
  DONE = "done",
  ERROR = "error",
  PASSWORD_INPUT = "password-input",
}

export const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const user = localStorage.getItem("currentUser");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch()
  const [whatShow, setWhatShow] = useState<PasswordResetStatus>(PasswordResetStatus.EMAIL_INPUT);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("resPass");
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const res = dispatch(
      userPasswordReset({
        email: formData.get("email") as string,
        return_url: window.location.href,
      })
    );

    if(res) {
      res.then(response => {
        const resp = (response.payload as { message: string }).message;
        if (!resp.toLowerCase().includes("error")) {
          localStorage.setItem("resPass", "true");
          setWhatShow(PasswordResetStatus.SUCCESS);
          setLoading(false);
        } else {
          setWhatShow(PasswordResetStatus.ERROR);
          setLoading(false);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          
        }
      });
    }
  };

  const handleNewPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const res = dispatch(
      userPasswordUpdate({
        password: formData.get("password") as string,
        token: token as string,
        uidb64: uidb64 as string,
      })
    );

    if(res) {
      res.then(response => {
        const resp = (response.payload as { message: string}).message;
        if (!resp.toLowerCase().includes("error")) {
          localStorage.removeItem("resPass");
          setWhatShow(PasswordResetStatus.DONE);
          setSearchParams({});
          setLoading(false);
          setTimeout(() => {
            navigate("/");
          }, 3000)
        } else {
          setWhatShow(PasswordResetStatus.ERROR);
          setSearchParams({});
          setLoading(false);
          localStorage.removeItem("resPass");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      })
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    const resPass = localStorage.getItem("resPass");
    if(user) {
      navigate("/");
    }
    if (resPass) {
      if(!email) {
        setWhatShow(PasswordResetStatus.SUCCESS);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setWhatShow(PasswordResetStatus.PASSWORD_INPUT);
      }
      
    }
  }, [email, navigate, token, uidb64, user])

  return (
    <section className="password-reset">
      <div className="container">
        {whatShow
          .toLowerCase()
          .includes(PasswordResetStatus.EMAIL_INPUT.toLowerCase()) && (
          <>
            <h2 className="title password-reset__title">
              Enter your email for reset password
            </h2>
            <form
              method="POST"
              onSubmit={handleSubmit}
              className="password-reset__form"
            >
              <TextField
                name="email"
                label="Enter your email"
                variant="outlined"
                className="password-reset__input"
              />
              <div className="password-reset__button-container">
                <Button
                  loading={loading}
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: colorsPrimary.main,
                    position: "relative",
                    width: "auto",
                    transitionDuration: "0.3s",
                    "&:hover": {
                      backgroundColor: colorsPrimary.light,
                    },
                  }}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </>
        )}
        {whatShow
          .toLowerCase()
          .includes(PasswordResetStatus.SUCCESS.toLowerCase()) && (
          <h2 className="title password-reset__title">
            Check your email for reset password
          </h2>
        )}
        {whatShow
          .toLowerCase()
          .includes(PasswordResetStatus.ERROR.toLowerCase()) && (
          <h2 className="title password-reset__title">Invalid email</h2>
        )}
        {whatShow
          .toLowerCase()
          .includes(PasswordResetStatus.PASSWORD_INPUT.toLowerCase()) && (
          <>
            <h2 className="title password-reset__title">
              Enter your new password
            </h2>
            <form
              method="POST"
              onSubmit={handleNewPasswordSubmit}
              className="password-reset__form"
            >
              <OutlinedInput
                name="password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                className="password-reset__input"
              />
              <div className="password-reset__button-container">
                <Button
                  loading={loading}
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: colorsPrimary.main,
                    position: "relative",
                    width: "auto",
                    transitionDuration: "0.3s",
                    "&:hover": {
                      backgroundColor: colorsPrimary.light,
                    },
                  }}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </>
        )}
        {whatShow
          .toLowerCase()
          .includes(PasswordResetStatus.DONE.toLowerCase()) && (
          <h2 className="title password-reset__title">Password was changed</h2>
        )}
      </div>
    </section>
  );
}