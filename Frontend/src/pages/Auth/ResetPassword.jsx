import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../../assets/svgs/muk.svg";
import { ArrowRight, Close } from "@material-ui/icons";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getAuthInformation,
  resetPassword,
} from "../../model/tools/AuthReducer";
import { motion, AnimatePresence } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const auth = useSelector(getAuthInformation);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    // Client-side validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      dispatch({
        type: "auth/setError",
        payload: passwordErrors.join(". "),
      });
      return;
    }

    if (password !== confirmPassword) {
      dispatch({
        type: "auth/setError",
        payload: "Passwords do not match",
      });
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({ token, password })
      ).unwrap();
      setSuccess(true);
      // Show success message for 3 seconds before redirecting
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              result.message ||
              "Password has been reset successfully. Please login with your new password.",
          },
        });
      }, 3000);
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Paper
                className="p-5 rounded shadow-sm text-center"
                elevation={2}
                sx={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
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
                    Reset Password
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Enter your new password below.
                  </Typography>
                </motion.div>

                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <TextField
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      helperText={
                        <Box component="span" sx={{ fontSize: "0.75rem" }}>
                          Password must be at least 8 characters long and
                          contain:
                          <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character (!@#$%^&*)</li>
                          </ul>
                        </Box>
                      }
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      required
                      fullWidth
                      className="mt-4"
                      disabled={auth.loading || success}
                      error={!!auth.error}
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={auth.loading || success}
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
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <TextField
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      helperText="Confirm your new password"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      fullWidth
                      className="mt-4"
                      disabled={auth.loading || success}
                      error={!!auth.error}
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                              disabled={auth.loading || success}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                    <Button
                      type="submit"
                      disabled={auth.loading || success}
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 3 }}
                      endIcon={!auth.loading && !success && <ArrowRight />}
                    >
                      {auth.loading ? (
                        <CircularProgress size={20} />
                      ) : success ? (
                        "Password Reset!"
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </motion.div>
                </form>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert
                        severity="success"
                        sx={{ mt: 3 }}
                        action={
                          <IconButton
                            onClick={() => setSuccess(false)}
                            size="small"
                          >
                            <Close />
                          </IconButton>
                        }
                      >
                        <Typography>
                          Password has been reset successfully. Redirecting to
                          login...
                        </Typography>
                      </Alert>
                    </motion.div>
                  )}

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
            </motion.div>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResetPassword;
