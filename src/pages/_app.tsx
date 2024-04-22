import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

const theme = createTheme({
  typography: {
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2rem",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
