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
import { v1 as uuidv1 } from "uuid";
import { theme } from "../../utils/theme";
import {User} from '../../types/User';
const colorsPrimary = theme.palette.primary;
const colorsSecondary = theme.palette.secondary;

enum Errors {
  Empty = "All fields must be filling",
}

export const SingUpInForm = () => {
  const {mainFormActive, setMainFormActive, users, setCurrentUser} = useContext(DreamsContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessege, setErrorMessage] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [value, setValue] = useState('1');
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  console.log(users)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight);
    }
  }, [contentHeight, value]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const newUser: User = {
        id: +uuidv1(),
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        is_staff: false,
      };
      setCurrentUser(newUser);
      sentRegistrateData(registerData);
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  // };

  // const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  // };

  useEffect(() => {
    setValue('1');
  }, [])

  return (
    <>
      <div
        className={classNames("sign-up-in-form__background", {
          active: mainFormActive,
        })}
      ></div>
      <div
        className={classNames("sign-up-in-form", {
          active: mainFormActive,
        })}
      >
        <IconButton
          aria-label="close"
          className="sign-up-in-form__close"
          sx={{ color: colorsPrimary.dark }}
          onClick={() => {
            setMainFormActive(false);
          }}
        >
          <CloseIcon />
        </IconButton>
        <TabContext value={value}>
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
          {/*  tabs */}
          <Box ref={contentRef}>
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
                    onChange={handleChange}
                  />
                  <TextField
                    error={errorMessege.length > 0}
                    name="email"
                    // id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    sx={{ margin: "0 auto" }}
                    className="sign-up-in-form__login"
                    onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
            <TabPanel value="2">
              <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1 } }}
                noValidate
                autoComplete="off"
                className="sign-up-in-form__sign-in"
                onSubmit={handleSubmit}
              >
                
                  <TextField
                    error={errorMessege.length > 0}
                    name="email"
                    id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    sx={{ margin: "0 auto" }}
                    onChange={handleChange}
                  />
                  {/* <Divider /> */}
                  <FormControl
                    sx={{ m: 1 }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
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
            <p className="sign-up-in-form__error-message">{errorMessege}</p>
          </Box>
        </TabContext>
      </div>
    </>
  );
}