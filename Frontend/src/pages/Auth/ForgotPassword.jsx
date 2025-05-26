import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../../assets/svgs/muk.svg";
import { ArrowRight, Close } from "@material-ui/icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import {
  getAuthInformation,
  forgotPassword,
} from "../../model/tools/AuthReducer";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(getAuthInformation);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      setSuccess(true);
      // Show success message for 3 seconds before redirecting
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              result.message ||
              "Password reset instructions have been sent to your email.",
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
                    Forgot Password
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Enter your email address and we'll send you instructions to
                    reset your password.
                  </Typography>
                </motion.div>

                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <TextField
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      helperText="Enter your registered email address"
                      label="Email"
                      type="email"
                      required
                      fullWidth
                      className="mt-4"
                      disabled={auth.loading || success}
                      error={!!auth.error}
                      autoComplete="email"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Box
                      sx={{ mt: 3 }}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Link to="/login" style={{ textDecoration: "none" }}>
                        <Button
                          color="inherit"
                          size="large"
                          disabled={auth.loading || success}
                        >
                          Back to Login
                        </Button>
                      </Link>

                      <Button
                        type="submit"
                        disabled={auth.loading || success}
                        variant="contained"
                        size="large"
                        endIcon={!auth.loading && !success && <ArrowRight />}
                      >
                        {auth.loading ? (
                          <CircularProgress size={20} />
                        ) : success ? (
                          "Email Sent!"
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </Box>
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
                          If an account exists with this email, you will receive
                          password reset instructions. Redirecting to login...
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

export default ForgotPassword;
