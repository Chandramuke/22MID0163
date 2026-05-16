"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary:   { main: "#00E5FF", contrastText: "#000" },
    secondary: { main: "#FF6B35" },
    background: { default: "#050A0F", paper: "#0D1821" },
    text: { primary: "#E8F4F8", secondary: "#7B9BAB" },
    success: { main: "#00E676" },
    warning: { main: "#FFD600" },
    error:   { main: "#FF1744" },
  },
  typography: {
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    button: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, letterSpacing: "0.08em" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 2, textTransform: "uppercase" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

export default theme;
