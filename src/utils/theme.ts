import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#016573",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#C86143",
      // light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      // contrastText: "#47008F",
    },
  },
});