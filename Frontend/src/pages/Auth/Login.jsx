import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../../assets/svgs/muk.svg";
import { ArrowRight, Close } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { getAuthInformation, SignIn } from "../../model/tools/AuthReducer";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector(getAuthInformation);

  // Show success message if redirected from password reset
  const [successMessage, setSuccessMessage] = useState(location.state?.message);

  useEffect(() => {
    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(SignIn({ email, password })).unwrap();
      // Get the intended destination from location state or default to role-based route
      const intendedDestination =
        location.state?.from || `/${result.data.user.role}`;
      navigate(intendedDestination, { replace: true });
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        style={{ width: "100%", height: "100%" }}
      >
        <Box
          height={"100vh"}
          width={"100vw"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          bgcolor="background.default"
        >
          <Container maxWidth={"sm"}>
            <Paper
              className="p-5 rounded text-center"
              elevation={0}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                width={250}
                src={Logo}
                alt="Logo"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Sign in to continue to your account
                </Typography>
              </motion.div>

              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert severity="success" sx={{ mb: 3 }}>
                      {successMessage}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} autoComplete="off">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText="Enter your email address"
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    className="mt-4"
                    autoComplete="off"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: "1px",
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Enter your password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
                    className="mt-4"
                    autoComplete="new-password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: "1px",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/forgot-password", { replace: true });
                      }}
                      sx={{ textDecoration: "none" }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    disabled={auth.loading}
                    variant="contained"
                    size="large"
                    fullWidth
                    disableElevation
                    endIcon={<ArrowRight />}
                  >
                    {auth.loading ? <CircularProgress size={20} /> : "Sign In"}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/signup", { replace: true });
                        }}
                        sx={{ textDecoration: "none" }}
                      >
                        Sign Up
                      </Link>
                    </Typography>
                  </Box>
                </motion.div>
              </form>

              <AnimatePresence>
                {auth.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      severity="error"
                      sx={{ mt: 3 }}
                      action={
                        <IconButton
                          onClick={() =>
                            dispatch({ type: "auth/removeAuthError" })
                          }
                          size="small"
                        >
                          <Close />
                        </IconButton>
                      }
                    >
                      <Typography>{auth.error}</Typography>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </Paper>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
