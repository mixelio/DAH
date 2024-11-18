import {Visibility, VisibilityOff} from '@mui/icons-material'
import {Box, Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {FormEvent, useContext, useEffect, useRef, useState} from 'react'
import sentRegistrateData from '../../utils/axiosClient';
import {Link} from 'react-router-dom';
import {DreamsContext} from '../../DreamsContext';
import classNames from 'classnames';
import { theme } from "../../utils/theme";
import {User} from '../../types/User';
const colorsPrimary = theme.palette.primary;
const colorsSecondary = theme.palette.secondary;

enum Errors {
  Empty = "All fields must be filling",
  EmailNotValid = "Use valid email",
  PasswordIncorrect = "Invalid password. Please try again.",
  NoRegistration = "Email not registered. Please sign up.",
}

export const SingUpInForm = () => {
  // #region variables
  const {mainFormActive, setMainFormActive, users, setCurrentUser, currentUser} = useContext(DreamsContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessege, setErrorMessage] = useState('');
  const [registerData, setRegisterData] = useState({
    first_name: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  })

  const [value, setValue] = useState('1');
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  // #endregion

  // #region Validation

  const emailValidator = (email: string) => {
    const emailRegrex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

    return emailRegrex.test(email)
  }

  // #endregion
  console.log(users);

  // #region hooks
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight);
    }
  }, [contentHeight, value]);

  useEffect(() => {
    setValue("2");
    setLoginData({
      login: "",
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!registerData.email.trim() || !registerData.password.trim()) {
      setErrorMessage(Errors.Empty);
    } else {
      const newUser: Pick<User,"first_name" | "email" | "password"> | null = {
        first_name: registerData.first_name,
        email: registerData.email,
        password: registerData.password,
      };
      setCurrentUser(newUser);
      sentRegistrateData(registerData);
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

  const handleLogIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(emailValidator(loginData.login));
    
    if (!emailValidator(loginData.login)) {
      setErrorMessage(Errors.EmailNotValid);
      return;
    } else if (!loginData.password.trim()) {
      setErrorMessage(Errors.Empty);
      return;
    }

    const checkUser =
      users.find((user) => user.email === loginData.login) === undefined
        ? false
        : users.find((user) => user.email === loginData.login);
    if(!checkUser) {
      setErrorMessage(Errors.NoRegistration);
      return;
    }

    if(checkUser.password === loginData.password) {
      setCurrentUser(checkUser);
      setLoginData({
        login: '',
        password: '',
      })
      setMainFormActive(false);
    } else {
      setCurrentUser(null);
      setErrorMessage(Errors.PasswordIncorrect)
    }
    setLoginData({
      login: "",
      password: "",
    });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // #endregion

  return (
    <>
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
                    name="name"
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
                <Divider />
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
                      label="Password_repeat"
                    />
                  </FormControl>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: colorsPrimary.main,
                    "&:hover": {
                      backgroundColor: colorsSecondary.main,
                    },
                  }}
                >
                  Sing Up
                </Button>
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
                  name="login"
                  id="outlined-basic"
                  label="E-mail"
                  value={loginData.login}
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

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: colorsPrimary.main,
                    "&:hover": {
                      backgroundColor: colorsSecondary.main,
                    },
                  }}
                >
                  Sing In
                </Button>
                <Link to="/" className="sign-up-in-form__foget">
                  forget password?
                </Link>
              </Box>
            </TabPanel>

            {/* errors message */}
            {errorMessege && (
              <p className="sign-up-in-form__error-message">{errorMessege}</p>
            )}
          </Box>
        </TabContext>
      </div>
    </>
  );
}