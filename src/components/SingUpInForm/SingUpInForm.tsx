import {Visibility, VisibilityOff} from '@mui/icons-material'
import {Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from '@mui/material'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {FormEvent, useEffect, useRef, useState} from 'react'
import sentRegistrateData from '../../utils/axiosClient';
import {Link} from 'react-router-dom';

export const SingUpInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState({
    emailError: false,
    passwordError: false,
  })
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
  });

  const [value, setValue] = useState('1');
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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
    const {name, value} = event.target;
    setHasError({
      emailError: false,
      passwordError: false,
    })
    setRegisterData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!registerData.email.trim()) {
      setHasError({
        emailError: true,
        passwordError: false,
      })
    } else {
      setHasError({
        emailError: false,
        passwordError: false,
      })
      sentRegistrateData(registerData);
    }
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className='sing-up-in-form'>
      <TabContext value={value}>
        <Box 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider'
          }}
        >
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Sing_Up" value="1" />
            <Tab label="Sing_In" value="2" />
          </TabList>
        </Box>
        {/*  tabs */}
        <Box 
          ref={contentRef}         >
          <TabPanel value="1">
            <Box
              component='form'
              sx={{ '& > :not(style)': { m: 1 } }}
              noValidate
              autoComplete="off"
              className="sing-up-in-form__sing-up"
              onSubmit={handleSubmit}
            >
              <TextField
                error={hasError.emailError}
                name="email"
                id="outlined-basic"
                label="E-mail" 
                variant="outlined"
                sx={{margin: "0 auto"}}
                className="sing-up-in-form__login"
                onChange={handleChange}
                onBlur={() => {
                  if(!registerData.email.trim()) {
                    setHasError(prevState => ({
                      ...prevState,
                      emailError: true,
                    }))
                  }
                }}
              />
              <FormControl sx={{ m: 1 }} variant="outlined" className="sing-up-in-form__password">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <FormControl sx={{ m: 1 }} variant="outlined" className="sing-up-in-form__password">
                <InputLabel htmlFor="outlined-adornment-password">Password repeat</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password_repeat"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password_repeat"
                />
              </FormControl>
              <Button variant="contained" type="submit">Sing Up</Button>
              <p>{}</p>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Box
              component='form'
              sx={{ '& > :not(style)': { m: 1 } }}
              noValidate
              autoComplete="off"
              className="sing-up-in-form__sing-in"
              onSubmit={handleSubmit}
            >
              <TextField
                error={hasError.emailError}
                name="email"
                id="outlined-basic"
                label="E-mail" 
                variant="outlined"
                sx={{margin: "0 auto"}}
                className="sing-up-in-form__login"
                onChange={handleChange}
                onBlur={() => {
                  if(!registerData.email.trim()) {
                    setHasError(prevState => ({
                      ...prevState,
                      emailError: true,
                    }))
                  }
                }}
              />
              <FormControl sx={{ m: 1 }} variant="outlined" className="sing-up-in-form__password">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                </FormControl>
                <Button variant="contained" type="submit">Sing In</Button>
                <Link to='/'>forget password?</Link>
            </Box>
          </TabPanel>
        </Box>
      </TabContext>
    </div>
  )
}