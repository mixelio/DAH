import { Visibility, VisibilityOff} from '@mui/icons-material'
import {Box, Button, CircularProgress, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {FormEvent, useContext, useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom';
import {DreamsContext} from '../../DreamsContext';
import classNames from 'classnames';
import { theme } from "../../utils/theme";
import {User} from '../../types/User';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {usersInit} from '../../features/users';
import {createUser, getLoginedUser, loginUser, verifyUser} from '../../api/users';
import LoadingButton from "@mui/lab/LoadingButton";
import { SnackbarProvider, useSnackbar } from "notistack";

const colorsPrimary = theme.palette.primary;
const colorsSecondary = theme.palette.secondary;

enum Errors {
  Empty = "All fields must be filling",
  EmailNotValid = "Use valid email",
  PasswordIncorrect = "Invalid password or email. Please try again.",
  NoRegistration = "Email not registered. Please sign up.",
  NoServerAnswer = "No server answer. Try again latter",
  AlreadyRegistrated = "User with this email already registrated",
  EqualCheck = "Passwords must be equial",
}

export const SingUpInForm = () => {
  // #region variables
  const {mainFormActive, setMainFormActive, setCurrentUser, currentUser} = useContext(DreamsContext);
  const {users} = useAppSelector(store => store.users);
  const dispatch = useAppDispatch();
  const [loginWaiting, setLoginWaiting] = useState<boolean>(false)

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [errorMessege, setErrorMessage] = useState('');
  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [repeatedPassword, setRepeatedPassword] = useState<string>('');
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState('1');
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  
  
  // #endregion

  // #region Validation

  const emailValidator = (email: string) => {
    const emailRegrex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

    return emailRegrex.test(email)
  }

  const passwordValidator = (password: string) => {
    const errors = [];

    if(password.localeCompare(repeatedPassword)) {
      errors.push("Passwords must be equial");
    }

    if(password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter (A-Z).");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter (a-z).");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must include at least one number (0-9).");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      errors.push(
        "Password must only include letters and numbers (no special characters)."
      );
    }


    return errors
  }

  // #endregion
  
  // #region hooks
  useEffect(() => {
    // const fetchUsers = async () => {
    //   await dispatch(usersInit());
    // }
    // fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight);
    }
  }, [contentHeight, value]);

  useEffect(() => {
    setValue("2");
    setLoginData({
      email: "",
      password: "",
    });
  }, [currentUser]);
  // #endregion

  // #region hendlers

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setErrorMessage('');
    setValue(newValue);
  };

  const handleChangeReg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('')
    const {name, value} = event.target;

    setRegisterData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const registerData = {
      first_name: data.get('first_name')?.toString() || '',
      last_name: data.get('last_name')?.toString() || '',
      email: data.get('email')?.toString() || '',
      password: data.get('password')?.toString() || '',
    }

    if (!registerData.email.trim() || !registerData.password.trim()) {
      setErrorMessage(Errors.Empty);
    } else {
      if(registerData.first_name.trim().includes(" ")) {
        const firstName = registerData.first_name.split(" ")[0]; // get first name
        const lastName = registerData.first_name.split(" ")[1]; // get last name if it exists

        setRegisterData((prevState) => ({ // set first and last name
          ...prevState,
          first_name: firstName,
          last_name: lastName,
        }))
      };

      const newUser: Pick<User,"first_name" | "last_name" | "email" | "password"> | null = {
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        email: registerData.email.toLowerCase(),
        password: registerData.password,
      };

      if(users.find(user => user.email === newUser.email) !== undefined) {
        setErrorMessage(Errors.AlreadyRegistrated);
        return
      }
      if (passwordValidator(newUser.password).length === 0) {
        setLoginWaiting(true);
        try {
          const response = await createUser(newUser);
          if (response) {
            enqueueSnackbar("Registration success", { variant: "success" });
            setOpen(true);
            if (event.target) {
              (event.target as HTMLFormElement).reset();
              setValue("2");
            };
          }
        } catch (error) {
          console.log(error, "user not created");
        } finally {
          setRegisterData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
          });
          setLoginWaiting(false);
          
        }
        
        // dispatch(userRegister({ ...newUser }))
      
      }
    }
  }

  const handleChangeLogIn = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrorMessage("");
    const { name, value } = event.target;

    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAutoComplete = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
        setErrorMessage("");
        const { name, value } = event.target;

        setLoginData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
  };

  const handleLogIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailValidator(loginData.email)) {
      setErrorMessage(Errors.EmailNotValid);
      return;
    } else if (!loginData.password.trim()) {
      setErrorMessage(Errors.Empty);
      return;
    }

    setLoginWaiting(true);

    try {
      const response = await loginUser(loginData);

      if (response.access && response.refresh) {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);

        const accessToken = localStorage.getItem("access");
        if(accessToken) {
          const verifyResponse = await verifyUser(accessToken);
          if (verifyResponse) {
            const currUser = getLoginedUser(accessToken);
            localStorage.setItem("currentUser", (await currUser).id.toString());
            setLoginData({
              email: "",
              password: "",
            });
            setMainFormActive(false);
            setLoginWaiting(false);
            return;
          }
        } else {
          setCurrentUser(null);
          setErrorMessage(Errors.PasswordIncorrect);
        }
        
      } else {
        setErrorMessage(Errors.PasswordIncorrect);
      }
      setLoginWaiting(false);
    } catch (error) {
      console.log(error)
      setErrorMessage(Errors.NoServerAnswer)
      setLoginWaiting(false);
    }


  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordRepeat = () => setShowPasswordRepeat((show) => !show);

  // #endregion

  useEffect(() => {
    dispatch(usersInit());
    enqueueSnackbar("Registration success", { variant: "success" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <SnackbarProvider>
      {/* fullscreen dark background for the form*/}
      <div
        className={classNames("sign-up-in-form__background", {
          active: mainFormActive,
        })}
      ></div>

      {/* form container */}
      <div
        className={classNames("sign-up-in-form", {
          active: mainFormActive,
        })}
      >
        {/* close button */}
        <IconButton
          aria-label="close"
          className="sign-up-in-form__close"
          sx={{ color: colorsPrimary.dark }}
          onClick={() => {
            setErrorMessage("");
            setMainFormActive(false);
          }}
        >
          <CloseIcon />
        </IconButton>

        <TabContext value={value}>
          {/* tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: colorsPrimary.light,
            }}
          >
            <TabList
              onChange={handleChangeTab}
              indicatorColor="primary"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: colorsPrimary.light,
                },
                "& button.Mui-selected": {
                  color: colorsPrimary.light,
                },
              }}
            >
              <Tab
                label="Sign_Up"
                value="1"
                sx={{
                  color: colorsPrimary.dark,
                  fontFamily: "inherit",
                }}
              />
              <Tab
                label="Sign_In"
                value="2"
                sx={{
                  color: colorsPrimary.dark,
                  fontFamily: "inherit",
                }}
              />
            </TabList>
          </Box>

          {/*  tabs bodies */}
          <Box ref={contentRef}>
            {/* form for registration */}
            <TabPanel value="1">
              <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1 } }}
                noValidate
                autoComplete="off"
                className="sign-up-in-form__sign-up"
                onSubmit={handleSubmit}
              >
                <div className="sign-up-in-form__fields-container">
                  <TextField
                    error={errorMessege.length > 0}
                    name="first_name"
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    sx={{ margin: "0 auto" }}
                    className="sign-up-in-form__login"
                    onChange={handleChangeReg}
                  />
                  <TextField
                    error={errorMessege.length > 0}
                    name="email"
                    // id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    sx={{ margin: "0 auto" }}
                    className="sign-up-in-form__login"
                    onChange={handleChangeReg}
                  />
                </div>
                <Divider style={{ opacity: "0" }} />
                <div className="sign-up-in-form__fields-container">
                  <FormControl
                    sx={{ m: 1 }}
                    variant="outlined"
                    className="sign-up-in-form__password"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChangeReg}
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
                      label="Password"
                    />
                  </FormControl>

                  <FormControl
                    sx={{ m: 1 }}
                    variant="outlined"
                    className="sign-up-in-form__password"
                  >
                    <InputLabel htmlFor="outlined-adornment-password-repeat">
                      Password repeat
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-repeat"
                      name="password_repeat"
                      type={showPasswordRepeat ? "text" : "password"}
                      onChange={(event) => {
                        setTimeout(
                          () => setRepeatedPassword(event.target.value),
                          3000
                        );
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPasswordRepeat
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPasswordRepeat}
                            edge="end"
                          >
                            {showPasswordRepeat ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password_repeat"
                    />
                  </FormControl>
                </div>
                <Divider style={{ opacity: "0" }} />
                <div className="sign-up-in-form__button-container">
                  <Button
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
                    {loginWaiting ? (
                      <CircularProgress
                        size={18}
                        sx={{
                          color: colorsSecondary.light,
                          height: "100%",
                        }}
                      />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </Box>
            </TabPanel>

            {/* form for login */}
            <TabPanel value="2">
              <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1 } }}
                noValidate
                autoComplete="off"
                className="sign-up-in-form__sign-in"
                onSubmit={handleLogIn}
              >
                <TextField
                  error={errorMessege.length > 0}
                  name="email"
                  id="outlined-basic"
                  label="E-mail"
                  value={loginData.email}
                  variant="outlined"
                  sx={{ margin: "0 auto" }}
                  onChange={handleChangeLogIn}
                  onFocus={handleAutoComplete}
                />
                {/* <Divider /> */}
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    error={errorMessege.length > 0}
                    id="outlined-adornment-password"
                    name="password"
                    value={loginData.password}
                    type={showPassword ? "text" : "password"}
                    onChange={handleChangeLogIn}
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
                    label="Password"
                  />
                </FormControl>
                {!loginWaiting ? (
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: colorsPrimary.main,
                      "&:hover": {
                        backgroundColor: colorsPrimary.light,
                      },
                    }}
                  >
                    Sign In
                  </Button>
                ) : (
                  <LoadingButton loading variant="outlined">
                    Submit
                  </LoadingButton>
                )}

                <Link to="/pass-reset" className="sign-up-in-form__foget" onClick={() => {
                  setErrorMessage("");
                  setMainFormActive(false);
                }}>
                  forget password?
                </Link>
              </Box>
            </TabPanel>

            {/* errors message */}

            {errorMessege && (
              <p className="sign-up-in-form__error-message">{errorMessege}</p>
            )}
            {registerData.password &&
              passwordValidator(registerData.password).length > 0 && (
                <p className="sign-up-in-form__error-message">
                  {passwordValidator(registerData.password)[0]}
                </p>
              )}
          </Box>
        </TabContext>
      </div>
      
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message="Registration success"
      />
    </SnackbarProvider>
  );
}