import {Visibility, VisibilityOff} from "@mui/icons-material"
import {Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material"
import {FormEvent, useState} from "react";

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
    
    console.log(registerData)
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
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1 } }}
        noValidate
        autoComplete="off"
        className="sing-up-in-form"
        onSubmit={handleSubmit}
      >
        <TextField
          error={hasError.emailError}
          required
          name="email"
          id="outlined-basic"
          label="E-mail" 
          variant="outlined"
          sx={{margin: "0 auto"}}
          className="sing-up-in-form__login"
          onChange={handleChange}
          onBlur={() => {
            console.log('onBlure', registerData.email.trim());
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
        <Button variant="contained" type="submit">Sing Up</Button>
      </Box>
  )
}