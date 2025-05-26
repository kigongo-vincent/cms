import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUpPage from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Lecturer from "./pages/lecturer/Lecturer";
import Student from "./pages/student/Student";
import Registrar from "./pages/registrar/Registrar";
import NotFound from "./pages/Auth/NotFound";
import { ThemeProvider, createTheme } from "@mui/material";
import SplashScreen from "./pages/Auth/SplashScreen";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getLecturers, getProgrammes } from "./model/tools/ProgrammesReducer";
import { getAuthInformation } from "./model/tools/AuthReducer";
import { Box, CircularProgress } from "@mui/material";

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const auth = useSelector(getAuthInformation);
  const location = useLocation();

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!auth.user?.tokens?.access) {
    // Save the attempted URL for redirecting back after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

// Auth Route component to prevent authenticated users from accessing auth pages
const AuthRoute = ({ children }) => {
  const auth = useSelector(getAuthInformation);
  const location = useLocation();

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Only redirect if we have a token and we're on an auth page
  if (auth.user?.tokens?.access && location.pathname !== "/") {
    // Get the intended destination from location state or default to role-based route
    const intendedDestination =
      location.state?.from ||
      (auth.user?.role === "student"
        ? "/student"
        : auth.user?.role === "lecturer"
        ? "/lecturer"
        : auth.user?.role === "registrar"
        ? "/registrar"
        : "/login");

    return (
      <Navigate
        to={intendedDestination}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProgrammes());
    dispatch(getLecturers());
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(30, 169, 78)",
      },
      secondary: {
        main: "rgb(221, 30, 75)",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 500,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 500,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
      },
      h6: {
        fontSize: "1.1rem",
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: "1.1rem",
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.95rem",
        lineHeight: 1.43,
      },
      button: {
        fontSize: "1rem",
        fontWeight: 500,
        textTransform: "none",
      },
      caption: {
        fontSize: "0.9rem",
      },
      overline: {
        fontSize: "0.85rem",
        fontWeight: 500,
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-input": {
              fontSize: "1rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "1rem",
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.9rem",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "1rem",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1) !important",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <SplashScreen />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignUpPage />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/lecturer/*"
          element={
            <ProtectedRoute>
              <Lecturer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/*"
          element={
            <ProtectedRoute>
              <Registrar />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
