"use client";
import { createTheme, alpha } from "@mui/material/styles";
import { Playfair_Display, Inter } from "next/font/google";

// Fonts are loaded via CSS variables injected in layout.tsx
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a1a2e",
      light: "#2d2d4e",
      dark: "#0d0d17",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c9a84c",
      light: "#e0c27a",
      dark: "#a07b2a",
      contrastText: "#1a1a2e",
    },
    background: {
      default: "#f8f6f0",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#5a5a7a",
    },
    divider: alpha("#1a1a2e", 0.12),
    error: { main: "#c62828" },
    success: { main: "#2e7d32" },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      fontSize: "clamp(2rem, 4vw, 3.25rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    overline: {
      letterSpacing: "0.15em",
      fontWeight: 600,
      fontSize: "0.7rem",
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        "*, *::before, *::after": { boxSizing: "border-box" },
        body: { overflowX: "hidden" },
        ":focus-visible": {
          outline: "3px solid #c9a84c",
          outlineOffset: "2px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.03em",
          borderRadius: 2,
          padding: "10px 28px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 20px rgba(26,26,46,0.25)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "0 2px 20px rgba(26,26,46,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 2, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none" },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid",
          borderColor: alpha("#1a1a2e", 0.12),
          "&:before": { display: "none" },
          "&.Mui-expanded": { margin: "8px 0" },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        },
      },
    },
  },
});

export default theme;
