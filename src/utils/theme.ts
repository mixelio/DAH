import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       color: "#33838f",
    //       "&:hover": {

    //       },
    //     },
    //   },
    // },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8, // Висота прогрес-бара
          borderRadius: 4, // Заокруглення країв
        },
        bar: {
          backgroundColor: "#87D068", // Кольорова смужка прогресу
        },
        dashed: {
          background: "none", // Приклад кастомізації dashed ліній
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#87D068",
      // light
      // dark
      // contrastText
    },
    secondary: {
      main: "#C86143",
      // light
      // dark
      // contrastText
    },
  },
});
